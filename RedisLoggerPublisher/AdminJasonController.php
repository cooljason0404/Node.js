<?php
/**
 * 坤哲測試
 * @package controller
 * @author Jason    
 * @version 2018.9.14
 * @copyright Copyright (c) 2016 Online Technology. All Rights Reserved
 */
class AdminJasonController extends AdminExtends {

    /**
     * 入口
     */
    public function indexAction() {
        //$this->TestAction();
    }

    public function showRedisLogAction(){
        $oBufferLogger = modelRedisLogger::getInstance();
        $logs = $oBufferLogger->getLog();
        $userinfo = array('index' => 0, 'limit' => 0);
        $this->assign('logs', $logs);
        $this->assign('userinfo', $userinfo);
        $this->display('/system/redisLog.tpl.php');
    }

    public function showRedisLogAjaxAction(){
        $oBufferLogger = modelRedisLogger::getInstance();
        $logs = $oBufferLogger->getLog();
        $this->outputAjax(1, "", $logs);
    }

    public function addAjaxAction(){
        $data = $_POST['data'] ? $_POST['data'] : "Online Technology. All Rights Reserved";
        $arr = array(
            'a' => "t",
            'b' => "t",
            'c' => "t",
            'd' => "t"
        );
        foreach($arr as $key => $val){
            modelRedisLogger::getInstance()->addLog('Jason Test Redis: '.$data);
        }
        $this->outputAjax(1, "", "");
    }

}
