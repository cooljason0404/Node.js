<?php
/**
 * Redis PubSub類型操作
 *
 * @package libRedis
 * @author Jason
 * @version 2018.09.14
 * @copyright Copyright (c) 2009 Online Technology. All Rights Reserved
 * @filesource
 */
class LibRedis_PubSub extends LibRedis_Extends{
    /**
     * 單例变量
     *
     * @static
     * @access private
     * @var LibRedis_PubSub
     */
    private static $_instance = null;

    /**
     * 構造器
     */
    private function __construct() {}

    /**
     * 單例化方法
     *
     * @static
     * @access public
     * @return LibRedis_PubSub
     */
    public static function getInstance($pLibRedis) {
        $className = __CLASS__;
        if(!isset(self::$_instance)) {
            self::$_instance = new LibRedis_PubSub();
            self::$_instance->_mainClass = $pLibRedis;
        }
        return self::$_instance;
    }

    /**
     * Publish messages to channel.
     * @param string $channal
     * @param string $message
     */
    public function publish($channal, $message){
        $this->_mainClass->connect();
        $this->_mainClass->redis->publish($channal, $message);
    }
}
