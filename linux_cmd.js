function linux_exec(cmd,callback)
{
    const exec = require('child_process').exec;

    var cmdStr = 'ls -l';
    
    exec(cmdStr, function (err, stdout, srderr) {
    
        if(err) {
            callback(err);
            console.log(srderr);
        
        } else {
            callback(stdout);
            console.log(stdout);
        
        }
    
    });
}
const exec = require('child_process').exec;

function sync_exec(cmd)
{
    const util = require('util');
    const exec = util.promisify(require('child_process').execSync);
    //const { stdout, stderr } = ;
    return exec(cmd);
}

//
const practice_exec = exec;

const new_line = `         `
class antminerS19{
    constructor(ip,port) {

        this.ipaddress = ip;
        if(port==null)
        {
            this.port = 4028;
        }
        else
        {
            this.port = port;
        }

    }
    async get_version()
    {
        const command = 'echo -n \'{"command":"version"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            const result = await practice_exec(command);   
            return result.stdout;
        } catch (error) {
            return error.stderr;
        }
    }
    get_estats(cb)
    {
        const command = 'echo -n \'{"command":"stats"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        exec(command,cb);   
    }
    async get_hashpower()
    {
        const command = 'echo -n \'{"command":\"ascset|0,hashpower\"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            const result = await practice_exec(command);   
            return this.ipaddress+","+result.stdout;
        } catch (error) {
            
            return error.stderr;
        }
    }
    return_probe_command()
    {
        //
        return 'echo -n \'{"command":"stats"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
    }
    process_state_rawdata(rawdata)
    {
        rawdata = rawdata.toString().replace(/[^\x20-\x7E]/g, "")
        try {
            let json = JSON.parse(rawdata);
        
            let arr = json['STATS'][1];
            const templete = {
                STATS : "Stat",
                Elapsed : "Elapsed",
                temp_chip1 : "temp_chip1",
                temp_chip2 : "temp_chip2",
                temp_chip3 : "temp_chip3",
                "GHS 5s" : "5sGHS",
                "GHS av" : "avgGHS",
                freq1 : "Freq",
            }
            
            var result = {};
            for(let x in arr)
            {
                try {
                    if(templete[x]!=undefined)
                    {
                        result[templete[x]]=arr[x].toString().trim();    
                    }
                } catch (error) {
                    continue;
                }
            }
            return result;  

        } catch (error) {
            return `process_rawdata${error}`;
        }
        
        
        /*
        {"STATUS": [{"STATUS": "S", "When": 1632435843, "Code": 70, "Msg": "CGMiner stats", "Description": "cgminer 1.0.0"}], "STATS": [{"BMMiner": "1.0.0", "Miner": "49.0.1.3", "CompileTime": "Sat May 15 21:17:18 CST 2021", "Type": "Antminer S19j Pro"}, {"STATS": 0, "ID": "BTM_SOC0", "Elapsed": 185806, "Calls": 0, "Wait": 0, "Max": 0, "Min": 99999999, "GHS 5s": 102232.59, "GHS av": 101925.32, "rate_30m": 101744.22, "Mode": 2, "miner_count": 3, "frequency": 525, "fan_num": 4, "fan1": 5760, "fan2": 5880, "fan3": 5880, "fan4": 5880, "temp_num": 3, "temp1": 69, "temp2_1": 74, "temp2": 69, "temp2_2": 74, "temp3": 70, "temp2_3": 75, "temp_pcb1": "55-53-68-69", "temp_pcb2": "52-55-68-69", "temp_pcb3": "53-54-68-70", "temp_pcb4": "0-0-0-0", "temp_chip1": "60-58-73-74", "temp_chip2": "57-60-73-74", "temp_chip3": "58-59-73-75", "temp_chip4": "0-0-0-0", "temp_pic1": "45-43-58-59", "temp_pic2": "42-45-58-59", "temp_pic3": "43-44-58-60", "temp_pic4": "0-0-0-0", "total_rateideal": 102003.0, "rate_unit": "GH", "total_freqavg": 525, "total_acn": 378, "total rate": 101925.32, "temp_max": 0, "no_matching_work": 628, "chain_acn1": 126, "chain_acn2": 126, "chain_acn3": 126, "chain_acn4": 0, "chain_acs1": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo", "chain_acs2": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo", "chain_acs3": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo", "chain_acs4": "", "chain_hw1": 237, "chain_hw2": 177, "chain_hw3": 214, "chain_hw4": 0, "chain_rate1": "36107.96", "chain_rate2": "32963.36", "chain_rate3": "33161.27", "chain_rate4": "", "freq1": 525, "freq2": 525, "freq3": 525, "freq4": 0, "miner_version": "49.0.1.3", "miner_id": "806ce5282b10481c"}], "id": 1}
        const templete = {
            STATS : "Stats",
            Elapsed : "worded time",
            temp_chip1 : "chip 1 temp",
            temp_chip2 : "chip 2 temp",
            temp_chip3 : "chip 3 temp",
            "GHS 5s" : "5s Hashrate",
            "GHS av" : "avg Hashrate",
            freq1 : "Freq",
        }
        */
          
    }
}
class avalonA10 {

    constructor(ip,port) {

        this.ipaddress = ip;
        if(port==null)
        {
            this.port = 4028;
        }
        else
        {
            this.port = port;
        }

    }
    async get_version()
    {
        const command = 'echo -n \'{"command":"version"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            const result = await practice_exec(command);   
            
            return result.stdout;
            
        } catch (error) {
            
            return error.stderr;
        }
    }
    /*
    async get_estats()
    {
        const command = 'echo -n \'{"command":"estats"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            let result = await practice_exec(command);   
            result = this.process_state_rawdata(result.stdout);
            let processed_data = `${this.ipaddress}${new_line}`; 
            for(let y in result)
            {
                processed_data=processed_data+`${y}:${result[y]}${new_line}`;
            }
            return processed_data;

        } catch (error) {
            
            return error.stderr;
        }


    }
    */
    get_estats(cb)
    {
        
        const command = 'echo -n \'{"command":"estats"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        exec(command,cb);   


    }
    
    async get_summary()
    {
        const command = 'echo -n \'{"command":"summary"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            const result = await practice_exec(command);   
            return this.ipaddress+","+result.stdout;
        } catch (error) {
            
            return error.stderr;
        }
    }
    async get_hashpower()
    {
        const command = 'echo -n \'{"command":"ascset|0,hashpower"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        try {
            const result = await practice_exec(command);   
            return this.ipaddress+","+result.stdout;
        } catch (error) {
            
            return error.stderr;
        }
    }
    process_state_rawdata(rawdata)
    {
        rawdata = rawdata.toString().replace(/[^\x20-\x7E]/g, "")
        try {
            let json = JSON.parse(rawdata);
            json = json['STATS'][0]['MM ID0'];
            let arr = json.split(']');
            let templete = {
                SYSTEMSTATU : "Stat",
                Elapsed : "Elapsed",
                Temp : "Temp",
                TMax : "TMax",
                TAvg : "TAvg",
                GHSspd : "GHSspd",
                GHSavg : "GHSavg",
                Freq : "Freq",
            }
            
            var result = {};
            for(let x in arr)
            {
                let tmp = arr[x].split("[");
                try {
                    if(templete[tmp[0].trim()]!=undefined)
                    {
                        result[templete[tmp[0].trim()]]=tmp[1].trim();    
                    }
                } catch (error) {
                    continue;
                }
            }
            return result;  
        } catch (error) {
            return `process_rawdata${error}`;
        }
         
        /*
        {
            Ver: '1126Pro-S-68-21071301_4ec6bb0_f6df907',
            DNA: '02010000abd64d92',
            MEMFREE: '1296936.0',
            NETFAIL: '155578 155590 265648 265659 265659 265669 0 0',
            SYSTEMSTATU: 'Work: In Work, Hash Board: 2',
            Elapsed: '315774',
            BOOTBY: '0x11.00000000',
            LW: '315363406',
            MH: '514 521',
            HW: '1035',
            DH: '25.097%',
            Temp: '38',
            TMax: '90',
            TAvg: '78',
            Fan1: '6757',
            Fan2: '6617',
            Fan3: '6582',
            Fan4: '6757',
            FanR: '100%',
            Vo: '356',
            PS: '0 1220 1424 225 3209 1424',
            PLL0: '11267 1 0 2652',
            PLL1: '10840 1 0 3079',
            GHSspd: '40587.26',
            DHspd: '28.162%',
            GHSmm: '56609.60',
            GHSavg: '41299.09',
            WU: '576941.61',
            Freq: '508.35',
            Led: '0',
            MGHS: '19789.22 21509.86',
            MTmax: '90 88',
            MTavg: '78 78',
            TA: '240',
            Core: 'A3201',
            PING: '78',
            POWS: '0',
            HASHS: '0 0',
            POOLS: '0',
            SoftOFF: '0',
            ECHU: '0 0',
            ECMM: '0',
            SF0: '496 516 536 556',
            SF1: '496 516 536 556',
            PVT_T0: '77  83  81  82  82  77  78  82  82  80  80  79  79  81  81  83  83  81  80  83  84  90  83  79  78  81  84  83  80  74  77  83  84  82  80  77  78  82  82  79  83  80  78  82  80  79  80  76  74  75  78  74  77  77  72  77  75  72  74  73  73  73  72  71  75  73  74  76  74  74  77  76  74  79  78  79  78  80  76  80  77  76  79  76  77  77  76  79  76  75  75  79  77  77  82  79  79  82  80  79  82  76  75  80  79  78  78  76  76  79  78  76  79  77  76  80  76  78  77  76',
            PVT_T1: '80  82  79  75  82  77  78  83  79  76  80  77  76  79  79  81  80  76  78  80  86  87  82  83  78  83  88  87  79  77  79  82  85  84  79  77  77  80  87  85  81  80  81  82  86  82  79  76  75  81  79  76  76  75  73  73  71  73  72  74  70  71  71  74  75  75  74  82  74  76  82  76  75  80  77  78  83  77  76  79  79  79  82  77  76  82  80  77  81  79  74  81  79  80  84  79  79  82  80  78  78  78  77  78  76  76  79  74  76  77  77  76  76  76  76  77  74  75  78  76',
            PVT_V0: '325 329 333 329 329 327 327 326 327 326 328 326 322 321 325 321 321 321 316 313 313 311 314 314 319 321 318 321 322 322 320 322 318 319 320 322 326 326 326 314 311 313 323 326 324 323 321 323 327 325 323 329 329 329 329 329 327 326 329 335 337 330 325 326 328 326 327 325 326 327 327 327 323 322 321 322 325 323 326 325 327 326 327 328 329 329 326 324 329 327 325 327 326 325 323 324 323 325 327 318 321 321 326 324 322 323 323 321 322 322 322 326 326 324 324 325 323 323 324 327',
            PVT_V1: '327 331 336 329 322 326 329 329 329 330 329 327 326 325 331 321 322 325 317 319 318 313 313 318 316 318 314 318 320 321 321 321 323 323 323 325 325 322 323 311 314 317 312 314 319 321 324 327 326 324 328 333 334 333 329 329 329 324 331 336 334 329 323 327 329 329 323 323 326 323 326 325 326 326 325 327 325 327 329 327 329 328 328 329 324 325 323 323 321 323 324 323 323 329 332 331 327 325 325 326 328 327 326 327 326 327 329 329 326 326 327 327 326 327 330 325 328 325 327 333',
            MW: '157747771 157747724',
            MW0: '6358 2763 6819 6442 4140 7719 7927 3698 7284 5916 6264 4704 6551 3082 6977 5067 6284 1820 6448 2914 1229 929 4760 5560 7934 4733 3024 4936 5483 6067 7993 4577 3594 3675 3836 4794 4529 8157 5433 3509 1704 3498 7253 6199 6696 5797 5615 8240 6860 8107 5496 8417 7960 5714 7305 6911 7488 8317 8236 8916 8507 8711 5082 7433 8494 8658 8107 8241 7516 7028 5809 8527 8017 5103 5494 4461 5756 6093 6442 4929 8549 6165 5604 6042 6864 7947 7156 4614 8138 4509 6606 6306 5200 5214 4527 5906 5085 2093 5989 4106 4215 3943 7627 4393 7615 7739 3604 5587 5239 6637 6037 7132 4255 6198 6942 4998 6215 7421 4093 6879',
            MW1: '6072 6821 7448 7717 1438 8027 8115 5157 6826 6870 7653 6444 4169 7385 7695 4724 5730 6707 2910 6630 3936 2800 1422 6123 6249 5236 1659 3354 6719 5737 5848 2569 6690 5827 6828 6060 6109 6005 5722 1216 4411 3754 2581 5068 5193 5455 5768 8295 7635 5598 6482 8227 7391 7647 8568 8370 7805 7674 8264 8394 8549 8244 8316 7083 8214 7481 7657 5409 8170 6397 6014 6721 4587 6403 7252 6941 5506 8062 8250 6056 8473 8009 7180 7581 7248 6254 7059 6832 4977 7514 7526 6166 8156 7357 7443 6828 6754 6279 7460 7031 6823 7064 8212 6272 7380 4663 4839 7773 8203 5739 8355 8363 5885 4826 8081 5253 6798 7924 6650 6442',
            ASICCRC0: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
            ASICCRC1: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
            CRC: '0 0',
            POW_I2C: 'OK',
            FACOPTS0: '',
            FACOPTS1: '',
            ATAOPTS0: '--avalon10-freq 496:516:536:556 --avalon10-voltage-level 47',
            ATAOPTS1: '--avalon10-freq 496:516:536:556 --avalon10-voltage-level 83',
            ADJ: '1',
            COP: '0 0 0',
            MPO: '3200',
            MVL: '87',
            ATABD0: '496 516 536 556',
            ATABD1: '496 516 536 556',
            WORKMODE: '1'
        }
        let templete = {
            SYSTEMSTATU : "",
            Elapsed : "worded time",
            Temp : "Ambiant temperture",
            TMax : "core temperture max",
            TAvg : "core temperture avg",
            GHSspd : "5s Hashrate",
            GHSavg : "avg Hashrate",
            Freq : "Freq",
        }
        */
         
    }
}
class gminer{
    constructor(ip,port) {

        this.ipaddress = ip;
        if(port==null)
        {
            this.port = 10555;
        }
        else
        {
            this.port = port;
        }

    }
    get_estats(cb)
    {
        //'http://140.238.126.231:80/api/v1'
        //192.168.3.205:10555/stat

        
        let url = "http://"+this.ipaddress+":"+this.port+"/stat";
        
        this.curl(url,cb);

    }
    process_state_rawdata(rawdata)
    {
        //rawdata = rawdata.toString().replace(/[^\x20-\x7E]/g, "")
        try {
            let json = JSON.parse(rawdata);
            
            let temp_str = "";
            let fan_str = "";
            for(let x in json['devices'])
            {
                temp_str+=json['devices'][x]["temperature"]+" ";
                fan_str+=json['devices'][x]["fan"]+" ";
            }

            
            let result = {
                Stat : json['miner'],
                Elapsed : json['uptime'],
                Temp : temp_str,
                algorithm : json['algorithm'],
                pool_speed : json['pool_speed'],
                Fan : fan_str,
            }
            
            
            return result;  
        } catch (error) {
            return `process_rawdata${error}`;
        }
    }
    curl(url,cb)
    {
        var request = require('request');
        
        request.get(
            url,null,(error, response, body)=>{
                if(response!=undefined)
                {

                    if(response.statusCode == 200){
                        var result = response.body;
                    }else{
                        //console.log(response.statusCode);
                    }
                }
                cb(error,result,null);
            }
        )
    }
/*
    post(url,body)
    {
        var request = require('request');
        
        request.post(
            {
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:url,
                body :"at="+JSON.stringify(body),
                encoding:'utf8'
            },
            function(error, response, body){
                
                if(response!=undefined)
                {
                    if(response.statusCode == 200){
                        console.log(response.body);
                    }else{
                        console.log(response.statusCode);
                    }
                }
                
            }
        );
    }
    */
}


class dummy_asic{
    constructor(ip,port) {

        this.ipaddress = ip;
        if(port==null)
        {
            this.port = 4028;
        }
        else
        {
            this.port = port;
        }

    }
    get_estats(cb)
    {
        
        const command = 'echo -n \'{"command":"estats"}\' | socat -t 30 stdio tcp:'+this.ipaddress+":"+this.port+',shut-none && echo';
        exec(command,cb);   


    }
    process_state_rawdata(rawdata)
    {
        rawdata = rawdata.toString().replace(/[^\x20-\x7E]/g, "")
        try {
            let json = JSON.parse(rawdata);
            json = json['STATS'][0]['MM ID0'];
            let arr = json.split(']');
            let templete = {
                SYSTEMSTATU : "Stat",
                Elapsed : "Elapsed",
                Temp : "Temp",
                TMax : "TMax",
                TAvg : "TAvg",
                GHSspd : "GHSspd",
                GHSavg : "GHSavg",
                Freq : "Freq",
            }
            
            var result = {};
            for(let x in arr)
            {
                let tmp = arr[x].split("[");
                try {
                    if(templete[tmp[0].trim()]!=undefined)
                    {
                        result[templete[tmp[0].trim()]]=tmp[1].trim();    
                    }
                } catch (error) {
                    continue;
                }
            }
            return result;  
        } catch (error) {
            return `process_rawdata${error}`;
        }
    }
}

module.exports = {

    avalonA10 : avalonA10,
    antminerS19 : antminerS19,
    dummy_asic : dummy_asic,
    gminer : gminer,
}