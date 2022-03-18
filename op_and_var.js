const db = require("./db_action.js");
const linux_cmd = require("./linux_cmd.js");
const mysql_db = require("./mysql_action.js");
var rigs_config = {};
var counting = 0;
var rigs_list_pulse_record = {};
//////////////////////////////////////////////////////////////
function log(any)
{
    console.log(any);
}

//////////////////////////////////////////////////////////////
function heartbeat()
{
    
    setInterval(()=>{
        pull_config_from_db();
    }, 5000);
    setInterval(()=>{
        get_local_asic_stat();
    }, 10000);
}
//////////////////////////////////////////////////////////////
function unescape(str)
{
    if(typeof(str)=="string")
    {
        let result = str.replace(/\n/g,"");
        return result.replace(/[^a-zA-Z\d\s]/g, '');
    }
    else
    {
        return str;
    }
}
Date.prototype.Format = function (fmt) {  
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function get_local_asic_stat()
{
    let rigs_arr = [];
    rigs_list_pulse_record={}
    for(let x in rigs_config.rigs_list)
    {
        switch(rigs_config.rigs_list[x].type)
        {
            case "avalon1126pro":
                rigs_arr[rigs_config.rigs_list[x].ipaddress]=new linux_cmd.avalonA10(rigs_config.rigs_list[x].ipaddress);
            break;
            case "antminers19pro":
                rigs_arr[rigs_config.rigs_list[x].ipaddress]=new linux_cmd.antminerS19(rigs_config.rigs_list[x].ipaddress);
            break;
            case "gminer":
                rigs_arr[rigs_config.rigs_list[x].ipaddress]=new linux_cmd.gminer(rigs_config.rigs_list[x].ipaddress);
            break;
            default:
                rigs_arr[rigs_config.rigs_list[x].ipaddress]=new linux_cmd.dummy_asic(rigs_config.rigs_list[x].ipaddress);
        }
    }
    //
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    for(let x in rigs_arr)
    {
        try {
            rigs_list_pulse_record[x]={
                ipaddress:x,
                timestamp: now,
            };
            rigs_arr[x].get_estats((err, stdout, stderr) =>{
                if (stderr) {
                    rigs_list_pulse_record[x]['data'] =JSON.stringify({text:unescape(err.toString())});
                }
                else
                {
                    rigs_list_pulse_record[x]['data'] = JSON.stringify(rigs_arr[x].process_state_rawdata(stdout));
                }
            });
        } catch (error) {
            log(error);
        }
    }
    setTimeout(() => {
        try {
            mysql_db.mysql_obj.insert(rigs_list_pulse_record,mysql_db.panel_machines_record);    
        } catch (error) {
            mysql_db.connect();
            log("insert into database error, trying to reconnect, get_local_asic_stat");
        }
        
    }, 5000);
}
//////////////////////////////////////////////////////////////
async function pull_config_from_db()
{
    rigs_config = await mysql_db.get_monitor_rigs_list();

}
//////////////////////////////////////////////////////////////
async function beat_for_testing()
{
    //

    //setInterval(()=>{log(Math.floor(Date.now()/1000) +" | "+ counting++)}, 1000);

}
//////////////////////////////////////////////////////////////
module.exports = { 
    heartbeat,
    beat_for_testing,
};