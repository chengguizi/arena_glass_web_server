function cb_process(){
        var cb_viso2_left = document.getElementById("cb-left-viso2");
        var cb_viso2_right = document.getElementById("cb-right-viso2");
        var cb_trajectories = document.getElementById("cb-trajectories");

        if (cb_viso2_left.checked == true){
            // Populate video source 
            // video_left.src = "http://" + robot_IP + ":8080/stream?topic=/left/debug_left&type=ros_compressed";
            video_left.src = "http://" + robot_IP + ":8080/stream?topic=/left/debug_left&type=mjpeg&quality=20";
        }else{
            video_left.src ="";
        }

        if (cb_viso2_right.checked == true){
            // Populate video source 
            video_right.src = "http://" + robot_IP + ":8080/stream?topic=/right/debug_right&type=ros_compressed";
        }else{
            video_right.src ="";
        }

        if (cb_trajectories.checked == true){
            // Populate video source 
            video_trajectories.src = "http://" + robot_IP + ":8080/stream?topic=/visualiser/trajectories&type=mjpeg&quality=60";
        }else{
            video_trajectories.src ="";
        }
}

window.onload = function () {
    // determine robot address automatically
    robot_IP = location.hostname;
    // set robot address statically
    // robot_IP = "arena-glass.local"; // window.location.hostname;

    document.getElementById("server-ip").innerHTML = 'Server IP:' + window.location.hostname;

    // // Init handle for rosbridge_websocket
    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9999"
    });

    server_status = document.getElementById("roslibjs-status");
    ros.on('connection', function() {
        server_status.innerHTML = "Socket OK";
        server_status.style.color = "limegreen";
    });

    ros.on('error', function(error) {
        server_status.innerHTML = "ERROR: " + error;
        server_status.style.color = "crimson";
    });

    ros.on('close', function() {
        server_status.innerHTML = "Socket Closed";
        server_status.style.color = "crimson";
    });
    
    

    // get handle for video placeholder
    video_left = document.getElementById('video-left');
    video_right = document.getElementById('video-right');
    video_trajectories = document.getElementById('video-trajectories');
    
    // video.src = "http://" + robot_IP + ":8080/stream?topic=/left/debug_left&type=mjpeg&quality=80";

    //// CLEAR CONSOLE ROUTINE
    document.getElementById("btn-clear").onclick = function(){
        var myConsole = document.getElementById("console-display");
        myConsole.innerHTML = "";
    }

    document.getElementById("btn-clear-record").onclick = function(){
        var myConsole = document.getElementById("console-record");
        myConsole.innerHTML = "";
    }
    

    //// RESET VIO ROUTINE
    var reset_topic = new ROSLIB.Topic({
        ros : ros,
        name : '/reset',
        messageType : 'std_msgs/Header'
    });

    reset_btn = document.getElementById("btn-reset");
    reset_btn.onclick = function(){
        // var reset_msg = new ROSLIB.Message({
        //     header : {
        //         stamp 
        //     }
        // });
        var myConsole = document.getElementById("console-display");
        myConsole.innerHTML = "====================== Restart ======================";
        reset_topic.publish({frame_id:'web',stamp:{}});
    }

    /// SERVICE RECORDER ROUTINE

    var record_service = new ROSLIB.Service({
        ros : ros,
        name : '/record',
        serviceType : 'std_srv/SetBool'
    });

    var request_start_record = new ROSLIB.ServiceRequest({
        data: true
    });

    var request_stop_record = new ROSLIB.ServiceRequest({
        data: false
    });

    document.getElementById("btn-record-start").onclick = function(){
        record_service.callService(request_start_record,function(result){
            var para = document.createElement("p");
            para.textContent = result.success.toString() + ', ' + result.message;
            para.style.cssText = 'margin-bottom: 0px;';
            para.className = "bg-warning px-1";

            var myConsoleRecord = document.getElementById("console-record");
            myConsoleRecord.insertBefore(para, myConsoleRecord.childNodes[0] );
        });
    }

    document.getElementById("btn-record-stop").onclick = function(){
        record_service.callService(request_stop_record,function(result){
            var para = document.createElement("p");
            para.textContent = result.success.toString() + ', ' + result.message;
            para.style.cssText = 'margin-bottom: 0px;';
            para.className = "bg-warning px-1";

            var myConsoleRecord = document.getElementById("console-record");
            myConsoleRecord.insertBefore(para, myConsoleRecord.childNodes[0] );
        });
    }


    //// RESET DRIVERS ROUTINE
    var reset_driver_service = new ROSLIB.Service({
        ros : ros,
        name : '/mon_drivers/start_stop',
        serviceType : 'rosmon/StartStop'
    });

    var request_restart_imu = new ROSLIB.ServiceRequest({
        node : 'imu',
        action : 3 // restart
    });

    var request_stop_imu = new ROSLIB.ServiceRequest({
        node : 'imu',
        action : 2 // stop
    });

    var request_restart_rs2 = new ROSLIB.ServiceRequest({
        node : 'stereo',
        action : 3 // restart
    });

    var request_stop_rs2 = new ROSLIB.ServiceRequest({
        node : 'stereo',
        action : 2 // stop
    });

    document.getElementById("btn-reset-imu").onclick = function(){
        reset_driver_service.callService(request_restart_imu,function(result){});
    }

    document.getElementById("btn-stop-imu").onclick = function(){
        reset_driver_service.callService(request_stop_imu,function(result){});
    }

    document.getElementById("btn-reset-rs2").onclick = function(){
        reset_driver_service.callService(request_restart_rs2,function(result){});
    }

    document.getElementById("btn-stop-rs2").onclick = function(){
        reset_driver_service.callService(request_stop_rs2,function(result){});
    }


    //// RESET VIO ROUTINE

    var reset_vio_service = new ROSLIB.Service({
        ros : ros,
        name : '/mon_vio/start_stop',
        serviceType : 'rosmon/StartStop'
    });


    var request_restart_viso2 = new ROSLIB.ServiceRequest({
        node : 'stereo_odometer',
        action : 3 // restart
    });

    var request_stop_viso2 = new ROSLIB.ServiceRequest({
        node : 'stereo_odometer',
        action : 2 // stop
    });

    var request_restart_visualiser = new ROSLIB.ServiceRequest({
        node : 'visualiser',
        action : 3 // restart
    });

    var request_stop_visualiser = new ROSLIB.ServiceRequest({
        node : 'visualiser',
        action : 2 // stop
    });

    var request_restart_ekf = new ROSLIB.ServiceRequest({
        node : 'ekf_fusion',
        action : 3 // restart
    });

    var request_stop_ekf = new ROSLIB.ServiceRequest({
        node : 'ekf_fusion',
        action : 2 // stop
    });

    document.getElementById("btn-reset-viso2").onclick = function(){
        reset_vio_service.callService(request_restart_viso2,function(result){});
    }

    document.getElementById("btn-stop-viso2").onclick = function(){
        reset_vio_service.callService(request_stop_viso2,function(result){});
    }

    document.getElementById("btn-reset-visualiser").onclick = function(){
        reset_vio_service.callService(request_restart_visualiser,function(result){});
    }

    document.getElementById("btn-stop-visualiser").onclick = function(){
        reset_vio_service.callService(request_stop_visualiser,function(result){});
    }

    document.getElementById("btn-reset-ekf").onclick = function(){
        reset_vio_service.callService(request_restart_ekf,function(result){});
    }

    document.getElementById("btn-stop-ekf").onclick = function(){
        reset_vio_service.callService(request_stop_ekf,function(result){});
    }
    

    subscribeDriverUpdates();
    subscribeVIOUpdates();
    subscribeRosout();
    subscribeCameraInfo();
    subscribeViso2Info();
    subscribeEkfPoseInfo();
    cb_process();

}