function init(){
    const livingType=$("input[name='livingType']:checked").val();
    if(!livingType){
        alert("请选择一个活体类型");
        return;
    }

    //调用sdk进行初始化 会返回一个iniMsg透传给服务器
    EsLivingDetection.verifyInit(`https://edis.esandcloud.com/efaceid/1.2.4/worker.min.1.2.4.js`, livingType).then(result => {
        //活体检测开始切换窗口
        $("#indexPage").attr("isShow","false");
        $("#veriyPage").attr("isShow","true");
        //透传初始化数据给服务器
        var formData=new FormData();
        formData.append("initMsg",result.data);
        //请求服务器获取token
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
            return EsLivingDetection.startLivingDetect(resData.token,containerID);
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
        console.error(ex);
    });
}