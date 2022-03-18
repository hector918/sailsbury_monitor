const mi = require('./mi.js');
const db = require('./db_action.js');
const tg_bot = require("./telebot.js");
const OV = require("./op_and_var.js");


//tg_bot.start_tg_bot(mi.get_monitoring_data);

//db.main().catch(console.error);
/*
host: ,
                user: ,
                password: ,
*/
//mi.mi_run(db.save_mihome,db.get_monitor_devices_list,db.save_sensors).catch(err => { mi.mi_run()} );


OV.heartbeat();
OV.beat_for_testing();


//tg_bot.text_tg_admin("salisbury tg bot restarted");

//setInterval(()=>{db.tg_heartbeat(tg_bot.rigs_config)}, 10000);
