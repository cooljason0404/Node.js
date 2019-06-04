<?php
/**
 * Redis类
 * php redis參考手冊 http://pecl.php.net/package/redis
 * @package lib
 * @author King<king@online.net.tw>
 * @version 2017.01.14
 * @copyright Copyright (c) 2010 Online Technology. All Rights Reserved
 * @filesource
 */

class libRedis {
    /**
     * 單實例變量
     * @static
     * @access private
     * @var array
     */
    private static $_instance = array();

    /**
     * 連接配置[host, port, passwd, db]
     * @static
     * @access private
     * @var array
     */
    private $_config = null;

    /**
     * 數據類型
     * @var string
     */
    private $_dataType = '';

    /**
     * redis實例
     * @var Redis
     */
    public $redis = null;

    /**
     * 構造器
     */
    private function __construct() {}

    /**
     * 單實例方法
     * @static
     * @param string $pSet
     * @return libRedis
     */
    public static function getInstance($pConfig) {
        $className = __CLASS__;
        if(!isset(self::$_instance[$pConfig])) {
            self::$_instance[$pConfig] = new $className;
            self::$_instance[$pConfig]->_setConfig($pConfig);
        }
        return self::$_instance[$pConfig];
    }

    /**
     * 設置數據庫連接配置
     *
     * @access private
     * @param string $pSset
     * @return void
     */
    private function _setConfig($pConfig) {
        $config = libRegistry::get('redis');
        if(!isset($config[$pConfig])) throw new RedisException('無法載入Redis配置:' . $pSet);
        $parseCfg = parse_url($config[$pConfig]);
        $this->_config = array(
            'host' => $parseCfg['host'],
            'port' => $parseCfg['port'],
            'passwd' => $parseCfg['pass'] ?? '',
            'db' => $parseCfg['user'],
        );
    }

    /**
     * 連結redit
     */
    public function connect() {
        if($this->redis) return true;
        $this->redis = new Redis();
        if(!$this->redis->connect($this->_config['host'], $this->_config['port'], 10)) {
            throw new RedisException('無法連接資料庫');
            return true;
        }
        if($this->_config['passwd'] != '') {
            if(!$this->redis->auth($this->_config['passwd'])) {
                throw new RedisException('資料庫認證失敗');
                return true;
            }
        }
        $this->redis->select($this->_config['db']);
    }

    /**
     * 設定數據類型
     * @var LibRedis_Set
     */
    public function getDataSet() {
        return LibRedis_Set::getInstance($this);
    }

    /**
     * 設定數據類型
     * @var LibRedis_List
     */
    public function getDataList() {
        return LibRedis_List::getInstance($this);
    }

    /**
     * 設定數據類型
     * @var LibRedis_Dict
     */
    public function getDict() {
        return LibRedis_Dict::getInstance($this);
    }

    /**
     * 設定數據類型
     * @var LibRedis_Hash
     */
    public function getDataHash() {
        return LibRedis_Hash::getInstance($this);
    }

    /**
     * 設定數據類型
     * @var LibRedis_String
     */
    public function getDataString() {
        return LibRedis_String::getInstance($this);
    }

    /**
     * 設定發送/訂閱
     * @var LibRedis_PubSub
     * @author Jason<Jason@online.net.tw>
     * @version 2018.09.14
     * @copyright Copyright (c) 2010 Online Technology. All Rights Reserved
     */
    public function getPubSub(){
        return LibRedis_PubSub::getInstance($this);
    }
}
