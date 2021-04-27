<?php
class Gallery extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        date_default_timezone_set("PRC");
    }

    public function path()
    {
        return '../../uploadImages';
    }

    //主动判断是否HTTPS
    public function isHTTPS()
    {
        if (defined('HTTPS') && HTTPS) return true;
        if (!isset($_SERVER)) return FALSE;
        if (!isset($_SERVER['HTTPS'])) return FALSE;
        if ($_SERVER['HTTPS'] === 1) {  //Apache
            return TRUE;
        } elseif ($_SERVER['HTTPS'] === 'on') { //IIS
            return TRUE;
        } elseif ($_SERVER['SERVER_PORT'] == 443) { //其他
            return TRUE;
        }
        return FALSE;
    }

    //  获取本地ip
    public function get_local_ip()
    {
        $preg = "/\A((([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\Z/";
        //获取操作系统为win2000/xp、win7的本机IP真实地址
        exec("ipconfig", $out, $stats);
        if (!empty($out)) {
            foreach ($out as $row) {
                if (strstr($row, "IP") && strstr($row, ":") && !strstr($row, "IPv6")) {
                    $tmpIp = explode(":", $row);
                    if (preg_match($preg, trim($tmpIp[1]))) {
                        return trim($tmpIp[1]);
                    }
                }
            }
        }
        //获取操作系统为linux类型的本机IP真实地址
        exec("ifconfig", $out, $stats);
        if (!empty($out)) {
            if (isset($out[1]) && strstr($out[1], 'addr:')) {
                $tmpArray = explode(":", $out[1]);
                $tmpIp = explode(" ", $tmpArray[1]);
                if (preg_match($preg, trim($tmpIp[0]))) {
                    return trim($tmpIp[0]);
                }
            }
        }
        return '127.0.0.1';
    }


    public function develop()
    {
        return false;
    }


    // 随机字符串

    public function hash($len)
    {
        $text = '';
        $possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ($i = 0; $i < $len; $i++) {
            $num = mt_rand(0, strlen($possible) - 1);
            $text .= $possible[$num];
        }
        return $text;
    }

    // 根据传入的状态 给出对应的图片库资源
    public function exportImages()
    {
        $sign = $this->input->get('status');
        $id = $this->input->get('id');
        if ($id <= 0) {
            $errResult = array(
                'code' => 200,
                'msg' => '加载完成!',
                'status' => 'complete'
            );
            die(json_encode($errResult));
        }
        if (empty($sign) || empty($id)) {
            $errResult = array(
                'code' => 0,
                'msg' => '缺少参数!',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = array();
        // 第一回查询取大于0 最大的规定列数
        // 之后的查询取比传入的id 小的列数
        if ($id > 1) {
            $result = $this->db->query("SELECT * FROM picturedepot WHERE sign = '{$sign}' AND id <= {$id} ORDER BY id DESC LIMIT 20")->result_array();
        } else {
            $result = $this->db->query("SELECT * FROM picturedepot WHERE sign = '{$sign}' AND id > {$id} ORDER BY id DESC LIMIT 20")->result_array();
        };
        $currentIdArr = array();
        foreach ($result as $key => $value) {
            array_push($currentIdArr, $value['id']);
            # code...
        }
        // 以降序排序 取最大值
        rsort($currentIdArr);
        if ($id > 1) {
            $currentId = @$currentIdArr[0] - 20;
        } else {
            $currentId = @$currentIdArr[0];
        }

        $dataResult = array(
            'code' => 1,
            'data' => $result,
            'status' => 'success',
            'currentId' => $currentId
        );
        die(json_encode($dataResult));
    }

    // 输出对应图库的描述
    public function getGalleryDesc()
    {
        $sign = $this->input->get('status');
        if (empty($sign)) {
            $errResult = array(
                'code' => 0,
                'msg' => '你还没有对应选择图库！',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = $this->db->query('SELECT galleryDescribe FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
        if (empty($result[0])) {
            $result[0] = array();
        }
        $dataResult = array(
            'code' => 1,
            'data' => $result[0],
            'status' => 'success'
        );
        die(json_encode($dataResult));
    }

    // 输出对应图库的头图
    public function getGalleryHeaderImage()
    {
        $sign = $this->input->get('status');
        if (empty($sign)) {
            $errResult = array(
                'code' => 0,
                'msg' => '你没选择图库aaaaa',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = $this->db->query('SELECT slidesImages FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
        if (empty($result[0])) {
            $result[0] = array();
        }
        $dataResult = array(
            'code' => 1,
            'data' => $result[0],
            'status' => 'success'
        );
        die(json_encode($dataResult));
    }

    // 输出对应图库的信息
    public function getGalleryInfo()
    {
        $sign = $this->input->get('status');
        if (empty($sign)) {
            $errResult = array(
                'code' => 0,
                'msg' => '你还没有对应选择图库！',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = $this->db->query('SELECT slidesImages,name,address,galleryDescribe,holdingTime FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
        if (empty($result[0])) {
            $result[0] = array();
        }
        $dataResult = array(
            'code' => 1,
            'data' => $result[0],
            'status' => 'success'
        );
        die(json_encode($dataResult));
    }
}
