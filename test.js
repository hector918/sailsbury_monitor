'use strict';

const fs = require('fs');

function process_state_rawdata(rawdata)
{
    rawdata = rawdata.toString().replace(/[^\x20-\x7E]/g, "")
    let json = JSON.parse(rawdata);
    json = json['STATS'][0]['MM ID0'];
    let arr = json.split(']');
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
    */
    let templete = {
        SYSTEMSTATU : "System Status",
        Elapsed : "worded time",
        Temp : "Ambiant temperture",
        TMax : "core temperture max",
        TAvg : "core temperture avg",
        GHSspd : "Hashrate by G in second",
        GHSavg : "Hashrate by G in avg",
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
}
let rawdata = fs.readFileSync('0',);


console.log(process_state_rawdata(rawdata));