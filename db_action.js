
const { MongoClient , ObjectId } = require('mongodb');

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://";
const client = new MongoClient(uri);
//================================================================================
const db_name = "miningsite01";
const conllection_mihome = "mihome";
const panel_config_name = "panel_config_01";
const panel_machines_record = "panel_machines_record_01";
const panel_sensors_record = "panel_sensors_record_01";

//
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
async function main(){

 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {

        console.error(e);
        await close_db();
    } finally {

    }
}
async function close_db()
{
    await client.close();
}
async function post_log(str)
{
    console.log(str);
}
async function remove_outdate()
{
    const result = await client.db(db_name).collection(conllection_mihome)

    .deleteMany({ "last_scraped": { $lt: date } });

    post_log(`${result.deletedCount} document(s) was/were deleted.`);
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
async function get_monitor_rigs_info()
{
    /*
    const document_id = "61439aa24317823488bc6513";
    const result = await client.db(db_name).collection(conllection_mihome).findOne({"_id":ObjectId(document_id)});
    */
    const result = await client.db(db_name).collection(panel_config_name).findOne({"document_name":"rigs_list"});
    return result;
}
///////////////////////////////////////////////////////////////
async function post_asic_pulse(sensors_in_json)
{
    const result = await client.db(db_name).collection(panel_machines_record).insertOne({data:sensors_in_json,timestamp:Date.now()});
    return result;
}
///////////////////////////////////////////////////////////////
module.exports = { 
    main ,
    save_mihome ,
    get_monitor_devices_list,
    get_monitor_rigs_info,
    save_sensors ,
    //tg_heartbeat,
    post_asic_pulse,
    check_client,
};
