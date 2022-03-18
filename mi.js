var timer;
const mihome = require('node-mihome');
var previous_mihome_data = {};
var monitor_devices_list = {};


async function mi_login()
{
    // local miIO
    mihome.miioProtocol.init();
        
    // local Aqara (ZigBee)
    mihome.aqaraProtocol.init();

    // cloud MIoT
    const username = '13922405511';
    const password = 'zoar1234';
    mihome.miCloudProtocol.REQUEST_TIMEOUT=10000;
    mihome.miCloudProtocol.login(username, password)
    .then(() => {
        console.log("connected to mi");
        
    })
    .catch(err => {
        console.log("error on login"+err);
    });
}
function get_monitoring_data()
{
    //
    let result = {};
    for(let x in previous_mihome_data)
    {
        //
        for(let y in monitor_devices_list)
        {
            if(previous_mihome_data[x].did==monitor_devices_list[y].did)
            {
                result[monitor_devices_list[y].did]=previous_mihome_data[x];
            }
        }
        
    }
    return result;
}
async function mi_run (post_mihome_to_mongo_func,get_monitor_devices_list_func,save_sensors_func)
{
    mi_login();
    
    /*https://github.com/maxinminax/node-mihome/blob/master/lib/protocol-micloud.js
    // return all devices from your acount with all information (deviceId, token, model ...) to create device in the next step
    
    let result = await mihome.miCloudProtocol.getDevices(null, options)
    .then(( response ) =>{
        console.log(response)
    })
    .catch(err => {

    });
    */
    
    timer = await setInterval(check_mi_device, 10000);
    //await mihome.miCloudProtocol.getDevices([deviceId1, deviceId2, ...], options); // get devices information from list ids
    //await mihome.miCloudProtocol.miioCall(deviceId, method, params, options); // call miio method with params via cloud protocol
    async function check_mi_device (){
        
        const options = { country: 'cn' }; // 'ru', 'us', 'tw', 'sg', 'cn', 'de' (Default: 'cn')
        await mihome.miCloudProtocol.getDevices(null, options)
        .then( response => {
            
            if(JSON.stringify(previous_mihome_data)!=JSON.stringify(response))
            {
                //
                previous_mihome_data = response;
                post_mihome_to_mongo_func(response);
                console.log("posted to mongodb");
            }
            else
            {
                console.log("same mi response");
            }            


            /////////////////////////////////////////////////
            get_monitor_devices_list_func().then(res=>{
                
                monitor_devices_list = res.device_monitored_list;
                let post_monitor_devices_list = [];
                
                var found = false;
                for(let x in previous_mihome_data)
                {
                    for(let y in monitor_devices_list)
                    {
                        if(previous_mihome_data[x].did==monitor_devices_list[y].did)
                        {
                            post_monitor_devices_list.push(previous_mihome_data[x]);
                            found = true;
                            break;
                        }
                    }
                    if(found)
                    {
                        found = false;
                        break;
                    }
                }
                save_sensors_func(post_monitor_devices_list);
            }).catch(err=>console.log("error on post monitor devices"+err));
        })
        .catch(err => {
            //mihome.miCloudProtocol.logout();
            console.log("error on get_devices"+err);
            if(!mihome.miCloudProtocol.isLoggedIn)
            {
                mi_login();
            } 

        });

        /*
        await mihome.miCloudProtocol.getDevices(['63160269'], options)
        .then(( response ) =>{
            console.log(response);
        })
        .catch(err => {
            console.log(err);
            mi_login();
        });
        */ 
    }
};

module.exports = { mi_run ,get_monitoring_data };