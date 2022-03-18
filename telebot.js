process.env.NTBA_FIX_319 = 1;
const linux_cmd = require("./linux_cmd.js");
const TelegramBot = require('node-telegram-bot-api');
const variable = require("./variable.js");

// replace the value below with the Telegram token you receive from @BotFather
const token = '1285599819:AAElak1-5z8rUqpM8SBLbuX0UNolLpjdepQ';//for nodejs bot

// Create a bot that uses 'polling' to fetch new updates
//hector chatid 791701773
// Matches "/echo [whatever]"
var bot = null;
var rigs_config = {
    document : null,
    get mongodb_document() {
        // getter, the code executed on getting obj.propName
        return this.document;
    },
  
    set mongodb_document(value) {
        // setter, the code executed on setting obj.propName = value
        this.document = value;
        //sendmessage_to_admin(JSON.stringify(value));
    }
};

//var rigs_config=null;
function connect_to_bot(get_selected_mi_data)
{
    
    bot = new TelegramBot(token, {polling: true});
    bot.on('callback_query', async (callbackQuery) => {
        const message = callbackQuery.message;
        const command = callbackQuery.data;
        bot.answerCallbackQuery(callbackQuery.id,{text: "query handled."});
        if(rigs_config.mongodb_document==null)
        {
            
            bot.sendMessage(message.chat.id,text="server not ready yet, wait 10 seconds.");
            //bot.sendMessage(message.chat.id,JSON.stringify(callbackQuery));
            console.log("rigs list = null");
            return;
        }
        tg_command_process(bot,message,command);
        
        //bot.sendMessage(message.chat.id, JSON.stringify(linux_cmd.sync_exec('echo -n "version" | socat -t 30 stdio tcp:192.168.10.105:4028,shut-none && echo')));
    });
     
    bot.onText(/^\/menu$/, function (msg) {
        const opts = {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                //resize_keyboard: true,
                one_time_keyboard: true,
                inline_keyboard: [
                    [
                        {text:'show ID', callback_data: 'get_id' },
                        {text:'get stats', callback_data: 'get_estats' },
                        {text:'get summary', callback_data: 'get_summary' },
                    ],
                    [
                        {text:'action', callback_data: 'submenu' },
                        
                    ],
                    
                ]
            }
        };
        
        try {
            let mi_data = get_selected_mi_data();
            
            if(get_len(mi_data)>0)
            {
                let result = "";
                for(let x in mi_data)
                {
                    result = result + mi_data[x].desc;
                }
                bot.sendMessage(msg.chat.id, result, opts);
            }
            else
            {
                bot.sendMessage(msg.chat.id, "Getting ready, ten more minutes");
            }
        } catch (error) {
            
        }
        
        
    });
    /*
    bot.onText(/\/command (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
    
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
        
        // send back the matched "whatever" to the chat
        bot.sendMessage(chatId, tg_message_process(resp));
    });
    
    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
    
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your fucking message');
      
    });
    */
    console.log("telegram bot running");
}
function get_len(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
async function tg_command_process(bot,message,command)
{
    const document = rigs_config.mongodb_document;
        
    var rigs_list = [];
    for(let x in document.rigs_list)
    {
        switch(document.rigs_list[x].type)
        {
            case "avalon1126pro":
                rigs_list.push(new linux_cmd.avalonA10(document.rigs_list[x].ipaddress));
            break;
            case "antminers19pro":
                rigs_list.push(new linux_cmd.antminerS19(document.rigs_list[x].ipaddress));
            break;
            default:
                continue;
        }
    }
    
    switch(command)
    {
        case "get_version":
            for(let x in rigs_list)
            {
                bot.sendMessage(message.chat.id, await rigs_list[x].get_version());
            }
        break;
        case "get_hashpower":
            for(let x in rigs_list)
            {
                bot.sendMessage(message.chat.id, await rigs_list[x].get_hashpower());
            }
        break;
        
        case "get_summary":
            for(let x in rigs_list)
            {
                bot.sendMessage(message.chat.id, await rigs_list[x].get_summary());
            }
        break;
        case "get_id":
            bot.sendMessage(message.chat.id, JSON.stringify(message.chat.id));
        break;
        case "submenu":
            const opts = {
                reply_to_message_id: message.message_id,
                reply_markup: {
                    //resize_keyboard: true,
                    //one_time_keyboard: true,
                    inline_keyboard: [
                        [
                            {text:'restart', callback_data: 'act_restart' },
                            {text:'shutdown', callback_data: 'act_shutdown' },
                            {text:'change workmode', callback_data: 'act_workmode' },
                        ],
                    ]
                }
            };
            bot.sendMessage(message.chat.id, "Sub menu create", opts);
        break;
        case "show_message":
            bot.sendMessage(message.chat.id, JSON.stringify(message));
        break;
        case "get_estats":
            for(let x in rigs_list)
            {
                
                try {
                    let json_result = await rigs_list[x].get_estats();
                    //if(json_result.match(/.socat\[./))
                        
                    bot.sendMessage(message.chat.id,JSON.stringify(json_result),{parse_mode:"markdown"});
                    
                    
                } catch (error) {
                    console.log(error);
                }
            }
        break;
        default:
            return "unknown command.";
    }
}


function sendmessage_to_admin(string_message)
{
    const admin_chatid = 791701773;
    bot.sendMessage(admin_chatid,string_message);

}

function sendmessage_to_chat(chatid,string_message)
{
    bot.sendMessage(chatid,string_message);
}


module.exports = {
    text_tg_admin : sendmessage_to_admin,
    text_via_tg : sendmessage_to_chat,
    start_tg_bot : connect_to_bot,
    rigs_config : rigs_config,
}