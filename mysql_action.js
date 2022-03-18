const mysql = require('mysql');
const db_name = "mining_container";
const conllection_mihome = "mihome";
const panel_config_name = "panel_config_01";
const panel_machines_record = "panel_machines_record_01";
const panel_sensors_record = "panel_sensors_record_01";
const util = require('util');

async function post_log(str)
{
    console.log(str);
}

class mysql_c{
    conn = null;
    database = null;
    host = "";
    user = "";
    pw = "";
    query = null;
    constructor(host,user,password,db) {
        this.host=host;
        this.user=user;
        this.pw=password;
        this.database=db;
        this.connect();
        this.query = util.promisify(this.conn.query).bind(this.conn);
    }
    async connect()
    {
        try {
            this.conn=mysql.createConnection({
                host: this.host,
                user: this.user,
                password: this.pw,
                database: this.database,
            });
            post_log("Connection established");
        } catch (error) {
            post_log("mysql error");
            post_log(error);
        }
    }
    async list_db()
    {
        //
        return await this.query('show databases;');
    }
    async list_tables()
    {
        //
        return await this.query('show tables;');
    }
    async get_one(sql)
    {
        return (await this.query(sql))[0];
    }
    async get_all(sql)
    {
        return (await this.query(sql));
    }
    get_fields_key(obj)
    {
        let result = [];
        for(let x in obj)
        {
            result.push(x);
        }
        return result;
    }
    unescape(str)
    {
        return str;
        if(typeof(str)=="string")
        {
//            return str.replace(/[^a-zA-Z\d]/g, '');
        }
        else
        {
  
        }
        
    }
    async insert(array,table)
    {
        /*
        INSERT INTO tbl_name (a,b,c)
        VALUES(1,2,3), (4,5,6), (7,8,9);
        */
        //
        for(let f in array)
        {
            var fields = this.get_fields_key(array[f]);
            break;
        }

        let value_string = "";
        for(let x in array)
        {
            value_string+="(";
            for(let y in fields)
            {
                //
                if(array[x][fields[y]]!=undefined)
                {
                    try {
                        value_string+="'"+array[x][fields[y]]+"',";    
                    } catch (error) {
                        post_log(error);
                    }
                }
                else
                {
                    value_string+="'',";
                }    
            }
            value_string=value_string.substr(0,value_string.length-1);
            value_string+="),";

        }
        value_string=value_string.substr(0,value_string.length-1);
        let fields_key = fields.join();
        let sql = `INSERT INTO ${table} (${fields_key}) VALUES${value_string};`;

        return (await this.query(sql));
    }
    async update(sql,where)
    {
        return (await this.query(sql));
    }
    async target_db(db)
    {
        this.database=db;
        this.query(`USE ${db}`);
        
    }
    async close_db()
    {
        con.end((err) => {
            // The connection is terminated gracefully
            // Ensures all remaining queries are executed
            // Then sends a quit packet to the MySQL server.
            post_log("mysql connection error");
            console.log(err);
        });
    }
}



async function save_sensors(sensors_in_json)
{
    const result = await client.db(db_name).collection("sensors_record").insertOne({data:sensors_in_json,timestamp:Date.now()});
    post_log(`post sensors id: ${result.insertedId}`);
}
async function get_monitor_devices_list()
{
    const document_id = "6138cfc14317823488bc6512";
    const result = await client.db(db_name).collection(conllection_mihome).findOne({"_id":ObjectId(document_id)});
    return result;
}
async function save_mihome(mihome)
{
    
    const document_id = "61367ab8162f210bedbaeeb9";
    //const result = await client.db(db_name).collection(conllection_mihome).insertOne(mihome);
    const result = await client.db(db_name).collection(conllection_mihome).findOneAndUpdate({"_id":ObjectId(document_id)},{$set:{data:mihome,timestamp:Date.now()}});
    post_log(`updated with the following id: ${result.value._id}`);
    

}
/*
async function tg_heartbeat(rigs_config)
{
    
    rigs_config.mongodb_document = await get_monitor_rigs_info();
    
}
*/
///////////////////////////////////////////////////////////////////////
async function check_client(chat)
{
    //
    const document_id = "6147fd92f0e0a52d1483d025";
    let temp_branch = "clients_list."+chat.id;
    
    const result = await client.db(db_name).collection(conllection_mihome).findOneAndUpdate({"_id":ObjectId(document_id)},{
        $set:{
            [temp_branch]:chat
        }
    });
    return result;
}
///////////////////////////////////////////////////////////////////////
async function get_monitor_rigs_list()
{
    try {
        let sql = `select * from ${panel_config_name} where name="rigs_list";`;
        let result = await mysql_obj.get_one(sql);
        return JSON.parse(result['data']);
    } catch (error) {
        post_log("get_monitor_rigs_list failed");
        post_log(error);
        return {};
    }
}
///////////////////////////////////////////////////////////////
async function post_asic_pulse(sensors_in_json)
{
    const result = await client.db(db_name).collection(panel_machines_record).insertOne({data:sensors_in_json,timestamp:Date.now()});
    return result;
}
///////////////////////////////////////////////////////////////

const mysql_obj = new mysql_c('.rds.amazonaws.com','','','mining_container');

get_monitor_rigs_list();
///////////////////////////////////////////////////////////////
module.exports = { 
    get_monitor_rigs_list,
    panel_machines_record,
    mysql_obj,
};
