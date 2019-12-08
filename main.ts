//% weight=0 color=#FF8B27 icon="\uf1b9" block="RRrobotII"
//uf1b9
namespace BBrobot {
    const I2C_OLED_ADDR = 0x78

    let event_src_ir = 12;
    let event_ir_sensor = 1;
    let Motor_R: boolean = false;
    let Motor_L: boolean = false;
    let Force: number = 10;


    function IR_sensorL(irdataL: number) {   //此為中斷觸發方塊
        control.inBackground(() => {
            let flag = false
            let last_flag = false
            while (true) {
                let ob: boolean = LBlock();
                if (ob) { flag = true } else { flag = false }
                if (flag != last_flag) {
                    if (flag) {
                        control.raiseEvent(event_src_ir, event_ir_sensor)
                        basic.pause(300) //300ms
                    }
                    last_flag = flag
                }
                basic.pause(1)

            }

        }
        )

    }
    //    
    //    背景執行紅外線測距
    //    @param irdata_Set ; eg: 512
    //    
    //    //% blockId="IR_EVENTL" block="ON obstacles on the left: |%irdata_Set"
    //    //% irdata_Set.min=0 irdata_Set.max=1023
    //    //% blockGap=10 weight=99   //代表其重要性，越重放越高
    //    export function onIRL(irdata_Set: number = 512, handler: Action) {
    //       IR_sensorL(irdata_Set);
    //        control.onEvent(event_src_ir, event_ir_sensor, handler); 

    //   }
    //    function IR_sensorR(irdata: number) { 
    //        control.inBackground(() => {
    //           let flag = false
    //            let last_flag = false
    //            while (true) {
    //                let ob: boolean = LBlock();
    //                if(ob){flag=true}else{flag=false}
    //                if (flag != last_flag) {
    //                    if (flag) { 
    //                        control.raiseEvent(event_src_ir, event_ir_sensor)
    //                        basic.pause(3)
    //                    }
    //                    last_flag = flag
    //                }
    //                basic.pause(1)
    //            }   
    //        }      
    //        )
    //    }

    /** Read the value sensed by the right side of the infrared sensor(return 0 to 1024).
    */
    //% blockId="Read_RBolck" block="get right IR data"
    //% blockGap=5 weight=65                 //與下一個方塊的間隙及排重
    export function Read_RBlock(): number {
        let ADL_R: number = 0;
        let ADH_R: number = 0;
        let Read_RIR: number = 0;
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)
        if (pins.digitalReadPin(DigitalPin.P8) == 1) Read_RIR = ADH_R - ADL_R;
        return (Read_RIR)
    }
    /** Read the value sensed by the left side of the infrared sensor(return 0 to 1024).
    */
    //% blockId="Read_LBolck" block="get left IR data"
    //% blockGap=15 weight=60                 //與下一個方塊的間隙及排重
    export function Read_LBlock(): number {
        let ADL_L: number = 0;
        let ADH_L: number = 0;
        let Read_LIR: number = 0;
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 0)

        Read_LIR = ADH_L - ADL_L;
        return (Read_LIR)
    }
    /**
        *Determine if there are obstacles on the right side.
        *@param thresholdR ; eg: 512
        */
    //% blockId="RBolck" block="is the right IR over %thresholdR strength"
    //% thresholdR.min=0 thresholdR.max=1023
    //% blockGap=5 weight=58
    export function RBlock(thresholdR: number = 512): boolean {
        let ADL_R: number = 0;
        let ADH_R: number = 0;
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)

        if (((ADH_R - ADL_R) > thresholdR) && (pins.digitalReadPin(DigitalPin.P8) == 1)) {
            //basic.showIcon(IconNames.House)
            return (true)
        } else {
            //basic.showIcon(IconNames.Cow)
            return (false)
        }
    }
    /**
    *Determine if there are obstacles on the left side.
    *@param thresholdL ; eg: 512
    */
    //% blockId="LBolck" block="is the left IR over %thresholdL strength"
    //% thresholdL.min=0 thresholdL.max=1023
    //% blockGap=10 weight=57
    export function LBlock(thresholdL: number = 512): boolean {
        let ADL_L: number = 0;
        let ADH_L: number = 0;
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = 0
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            ADH_L = pins.analogReadPin(AnalogPin.P1)
            pins.digitalWritePin(DigitalPin.P12, 0)
        }

        if ((ADH_L - ADL_L) > thresholdL) {//512) { 
            //basic.showIcon(IconNames.House)
            return (true)
        } else {
            //basic.showIcon(IconNames.Cow)
            return (false)
        }
    }


    //輸出脈波
    //% blockId="IRbolck" block="Out pulse & show-04"
    //% blockGap=10 weight=55
    //export function IRblock() {
    //    ADL_L = pins.analogReadPin(AnalogPin.P1)
    //    ADL_R = pins.analogReadPin(AnalogPin.P2)
    //    pins.digitalWritePin(DigitalPin.P12, 1)
    //    control.waitMicros(250)
    //    ADH_L = pins.analogReadPin(AnalogPin.P1)
    //    ADH_R = pins.analogReadPin(AnalogPin.P2)
    //    pins.digitalWritePin(DigitalPin.P12, 0)

    //    if ((ADH_L-ADL_L) > 512) { 
    //basic.showIcon(IconNames.House)
    //        led.plot(0, 0)
    //        led.unplot(0,4)
    //    } else {
    //basic.showIcon(IconNames.Cow)
    //        led.plot(0, 4)
    //        led.unplot(0,0)
    //    }

    //    if ((ADH_R-ADL_R) > 512) { 
    //basic.showIcon(IconNames.House)
    //        led.plot(4, 0)
    //        led.unplot(4, 4)
    //   } else {
    //basic.showIcon(IconNames.Cow)
    //        led.plot(4, 4)
    //        led.unplot(4,0)
    //       }

    //return(true)       
    //}
    /**
    *Tobbie-II walks forward.
    */
    //% blockId="forward" block="Tobbie-II walking forward"
    //% blockGap=3 weight=35
    export function forward() {
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }
    /**
    *Tobbie-II walks backward.
    */
    //% blockId="backward" block="Tobbie-II walking backward"
    //% blockGap=3  weight=34
    export function backward() {
        if (Force != 0) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            Force = Force - 1;
        }
        if (pins.digitalReadPin(DigitalPin.P8) == 1) { Force = 10 }

    }
    /**
    *Tobbie-II stops walking.
    */
    //% blockId="stopWalk" block="Tobbie-II stop walking"
    //% blockGap=10 weight=33
    export function stopWalk() {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    /**
    *Tobbie-II rotates to the right.
    */
    //% blockId="rightWard" block="Tobbie-II turns right"
    //% blockGap=3  weight=32
    export function rightWard() {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        Motor_L = false
        Motor_R = true
    }
    /**
    *Tobbie-II rotates to the left.
    */
    //% blockId="leftWard" block="Tobbie-II turns left"
    //% blockGap=3  weight=31
    export function leftWard() {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Motor_L = true
        Motor_R = false
    }
    /**
    *Tobbie-II stops rotating.
    */
    //% blockId="stopTurn" block="Tobbie-II stops rotating."
    //% blockGap=10 weight=30
    export function stopTurn() {
        if (Motor_L || Motor_R) {
            if (Motor_R) {
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 0)
            } else {
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 1)
            }
            basic.pause(50)
        }
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            pins.digitalWritePin(DigitalPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P16, 0)
            Motor_L = false
            Motor_R = false
        }
    }

    /**
       *Tobbie-II stamps his foot for a certain number of times.
       *@param time describe parameter here, eg:5
       */
    //% blockId="vibrate" block="Tobbie-II stamps %time times"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=25
    //% advanced=true
    export function vibrate(time: number): void {
        if (time > 100) { time = 100 }
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P13, 1)  //向前
            pins.digitalWritePin(DigitalPin.P14, 0)
            basic.pause(150)
            pins.digitalWritePin(DigitalPin.P13, 0)  //向後
            pins.digitalWritePin(DigitalPin.P14, 1)
            basic.pause(150)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)      //停止
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    /**
       *Tobbie-II shakes his head for a certain number of times.
       *@param time describe parameter here, eg:5
       */
    //% blockId="shake_head" block="Tobbie-II shakes head %time times"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=26
    //% advanced=true
    export function shake_head(time: number): void {
        if (time > 100) { time = 100 }
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P15, 1)  //左轉
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P15, 0)  //右轉
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P15, 0)      //停止行走
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    /**
        *Tobbie-II repeats the dance for for a certain number of times.
        *@param time describe parameter here, eg:5
        */
    //% blockId="dance" block="Tobbie-II dances %time times"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=24
    //% advanced=true
    export function dance(time: number): void {
        if (time > 100) { time = 100 }
        for (let i = 0; i < time; i++) {
            pins.digitalWritePin(DigitalPin.P13, 0)  //向後
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.digitalWritePin(DigitalPin.P15, 0)  //右轉
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P13, 1)  //向前
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)  //左轉
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    /**
        *Tobbie II shows his mood on the face (APP only).
        *@param RX_Data describe parameter here
        */
    //% blockId="BLE_DOT" block="Tobbie II shows mood on face(APP only) %RX_Data"
    //% blockGap=5 weight=23
    //% advanced=true
    export function drawFace(RX_Data: string): void {
        basic.clearScreen()
        for (let PY = 0; PY <= 4; PY++) {
            let PLOT_DATA: number = parseInt(RX_Data.substr(PY * 2 + 1, 2))
            for (let PX = 0; PX <= 4; PX++) {
                if (PLOT_DATA % 2 == 1) {
                    led.plot(PX, PY)
                    PLOT_DATA = PLOT_DATA - 1
                }
                PLOT_DATA = PLOT_DATA / 2
            }
        }
    }


    function sendSoundBit(bitNum: boolean) {

        if (bitNum == true) {
            pins.digitalWritePin(DigitalPin.P5, 1)
            control.waitMicros(3000)
            pins.digitalWritePin(DigitalPin.P5, 0)
            control.waitMicros(1000)

        }
        else {
            pins.digitalWritePin(DigitalPin.P5, 1)
            control.waitMicros(1000)
            pins.digitalWritePin(DigitalPin.P5, 0)
            control.waitMicros(3000)
        }
    }

    //% blockId="SND_NUM" block="Send Number %soundNumber Sound"
    //% blockGap=5 weight=22
    //% advanced=true
    export function sendSoundNumber(soundNumber: number) {
        let bitBuf = [false, false, false, false, false, false, false, false];
        let bitTool = 0b00000001;

        pins.digitalWritePin(DigitalPin.P5, 0)

        for (let index = 0; index < 8; index++) {
            if (bitTool == (soundNumber & bitTool)) {
                bitBuf[index] = true
            }
            bitTool = bitTool << 1;
        }

        control.waitMicros(6000)
        for (let index = 0; index < 8; index++) {
            if (bitBuf[index] == true) {
                sendSoundBit(true);
            }
            else {
                sendSoundBit(false);
            }
        }

        pins.digitalWritePin(DigitalPin.P5, 1)

    }

//write commond to the i2c oled
    function i2cOledWriteCmd(i2cCmd: number) {
        let buf = pins.createBuffer(2);
        buf[0] = 0x00;
        buf[1] = i2cCmd;
        pins.i2cWriteBuffer(I2C_OLED_ADDR, buf);
    }
//write data to the i2c oled
    function i2cOledWriteData(i2cData: number) {
        let buf = pins.createBuffer(2);
        buf[0] = 0x40;
        buf[1] = i2cData;
        pins.i2cWriteBuffer(I2C_OLED_ADDR, buf);
    }
//fill the i2c oled with i2cData
    function i2cOledFill(i2cData: number) {
        for (let index1 = 0; index1 < 8; index1++) {
            i2cOledWriteCmd(0xb0 + index1);
            i2cOledWriteCmd(0x01);
            i2cOledWriteCmd(0x10);
            for (let index2 = 0; index2 < 128; index2++) {
                i2cOledWriteData(i2cData);
            }
        }
    }
    function i2cOledSetPos(xPos:number,yPos:number) {
        i2cOledWriteCmd(0xb0 + yPos);
        i2cOledWriteCmd(((xPos & 0xf0) >> 4) | 0x10);
        i2cOledWriteCmd((xPos & 0x0f) | 0x01);
    }



    function i2cOledInit() {
        basic.pause(100);
        i2cOledWriteCmd(0xae)//--turn off oled panel
        i2cOledWriteCmd(0x00)//---set low column address
        i2cOledWriteCmd(0x10)//---set high column address
        i2cOledWriteCmd(0x40)//--set start line address  Set Mapping RAM Display Start Line (0x00~0x3F)
        i2cOledWriteCmd(0x81)//--set contrast control register
        i2cOledWriteCmd(0xCF) // Set SEG Output Current Brightness
        i2cOledWriteCmd(0xa1)//--Set SEG/Column Mapping     0xa0×óÓÒ·´ÖÃ 0xa1Õý³£
        i2cOledWriteCmd(0xc8)//Set COM/Row Scan Direction   0xc0ÉÏÏÂ·´ÖÃ 0xc8Õý³£
        i2cOledWriteCmd(0xa6)//--set normal display
        i2cOledWriteCmd(0xa8)//--set multiplex ratio(1 to 64)
        i2cOledWriteCmd(0x3f)//--1/64 duty
        i2cOledWriteCmd(0xd3)//-set display offset	Shift Mapping RAM Counter (0x00~0x3F)
        i2cOledWriteCmd(0x00)//-not offset
        i2cOledWriteCmd(0xd5)//--set display clock divide ratio/oscillator frequency
        i2cOledWriteCmd(0x80)//--set divide ratio, Set Clock as 100 Frames/Sec
        i2cOledWriteCmd(0xd9)//--set pre-charge period
        i2cOledWriteCmd(0xf1)//Set Pre-Charge as 15 Clocks & Discharge as 1 Clock
        i2cOledWriteCmd(0xda)//--set com pins hardware configuration
        i2cOledWriteCmd(0x12)
        i2cOledWriteCmd(0xdb)//--set vcomh
        i2cOledWriteCmd(0x40)//Set VCOM Deselect Level
        i2cOledWriteCmd(0x20)//-Set Page Addressing Mode (0x00/0x01/0x02)
        i2cOledWriteCmd(0x02)//
        i2cOledWriteCmd(0x8d)//--set Charge Pump enable/disable
        i2cOledWriteCmd(0x14)//--set(0x10) disable
        i2cOledWriteCmd(0xa4)// Disable Entire Display On (0xa4/0xa5)
        i2cOledWriteCmd(0xa6)// Disable Inverse Display On (0xa6/a7) 
        i2cOledWriteCmd(0xaf)//--turn on oled panel
        i2cOledFill(0x03)
        i2cOledSetPos(0,0)
    }

    //% blockId="SHW_FACE" block="Show face %faceNumber"
    //% blockGap=5 weight=21
    //% advanced=true
    export function showFace(faceNumber: number) {
        i2cOledInit();
    }
}
