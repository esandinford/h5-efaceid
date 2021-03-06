function init(){
    const livingType=$("input[name='livingType']:checked").val();
    if(!livingType){
        alert("请选择一个活体类型");
        return;
    }

    var config={
        // 是否需要视频
        needVideo: "true",
        // 是否将视频上传到oss服务器中，填true时会在需要视频时返回一个视频下载链接
        useCloudStorage: true,
        style : {
            progressStaGradient : "#111",
            progressEndGradient : "#fff",
            progressBgColor : "#ff123f",
            maskColor : "#11f",
            topLabelColor: "#0fa"
        },
        takeImageNumber: 2,
        language: 'CN'
    }

    // 调用sdk进行初始化 会返回一个iniMsg透传给服务器
    // TODO: 建议使用最新版的sdk
    EsLivingDetection.verifyInit(`https://edis.esandcloud.com/efaceid/1.6.1/worker.min.1.6.1.js`, livingType,config).then(result => {
        //活体检测开始切换窗口
        $("#indexPage").attr("isShow","false");
        $("#veriyPage").attr("isShow","true");
        //透传初始化数据给服务器
        var formData=new FormData();
        formData.append("initMsg",result.data);
        //透传给服务器
        return axios({
            method: 'post',
            url: '/init',
            headers: {"Content-Type": "multipart/form-data"},
            data:formData,
        });
    }).then(res=>{
        const resData=res.data;
        //用来放置视频的容器
        const containerID="videoContainer";
        //开始活人认证
        if(resData.code==="0000"){
            //当前期望调用的摄像头0为默认摄像头
            var deviceId=0;
            return EsLivingDetection.startLivingDetect(resData.token,containerID,deviceId);
        }else{
            throw resData;
        }

    }).then(result=>{
        //活体检测成功
        var formData=new FormData();
        formData.append("token",result.data.token);
        formData.append("verifyMsg",result.data.verifyMsg);
        //传给服务器进行服务器端认证
        return axios({
            method: 'post',
            url: `/verify`,
            headers: {"Content-Type": "multipart/form-data"},
            data:formData,
        });

    }).then(result=>{
        let resultData=result.data;
        /*
        *
        *
        * */
        if(resultData.code==="0000"){
            //活体检测结束切换窗口
            $("#indexPage").attr("isShow","true");
            $("#veriyPage").attr("isShow","false");
            const newStr= $("#console").html()+ JSON.stringify(resultData);
            $("#console").html(newStr);
        }else{
            throw result;
        }
    }).catch(ex=>{
        //程序发生异常
        console.error(ex);
    });
}