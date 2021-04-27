<?php
class GalleryBackground extends CI_Controller
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
        if (defined('HTTPS') && HTTPS) {
            return true;
        }
        if (!isset($_SERVER)) {
            return false;
        }
        if (!isset($_SERVER['HTTPS'])) {
            return false;
        }
        if ($_SERVER['HTTPS'] === 1) {  //Apache
            return true;
        } elseif ($_SERVER['HTTPS'] === 'on') { //IIS
            return true;
        } elseif ($_SERVER['SERVER_PORT'] == 443) { //其他
            return true;
        }
        return false;
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
        return true;
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
    public function upload()
    {
        $files = $_FILES;
        $sign = $this->input->post('status');
        if (!isset($files['image'])) {
            $err_json = array('status' => '0', 'msg' => '没有图呢?', 'status' => 'error');
            die(json_encode($err_json));
        }

        // 比较图片 看看图片是否上传过
        // 待定
        // 占位符


        $image = $files['image'];
        $imageName = date('Y-m-d', time()) . '_' . $this->hash(20);
        $imageFile = $image['tmp_name'];
        // 上传前的名字
        $origin_name = $image['name'];
        $imageType = substr(strrchr($image['name'], '.'), 1);

        if (!file_exists($this->path())) {
            mkdir($this->path());
            chmod($this->path(), 0777);
        }


        $path = $this->path() . '/' . $imageName . '.' . $imageType;
        $uploadFileStatus = move_uploaded_file($imageFile, $path);

        if (!$uploadFileStatus) {
            $err_json = array(
                'code' => '0',
                'msg' => '图片文章没有保存到服务器中 请重新选择图片上传',
                'status' => 'error'
            );
            die(json_encode($err_json));
        }


        // 获取图片宽度与高度在存储成功后
        $width = getimagesize($path);
        $height = getimagesize($path);
        if (!empty($width)) {
            $width = $width[0];
        } else {
            $width = 300;
        }
        if (!empty($height)) {
            $height = $height[1];
        }
        $config['image_library'] = 'gd2';
        $config['source_image'] = $path;
        $config['create_thumb'] = true;
        $config['maintain_ratio'] = true;
        $config['quality'] = '30%';
        $config['thumb_marker'] = '_thumb';
        $config['width'] = $width / 2;
        $config['height'] = $height / 2;
        $this->load->library('image_lib', $config);
        $thumb = $this->image_lib->resize();
        if (!$this->image_lib->resize()) {
            echo $this->image_lib->display_errors();
        }


        $netWorkProtocol = $this->isHTTPS() ? 'https://' : 'http://';
        $get_local_ip = $this->get_local_ip();
        $imagePath = $this->develop() ? $netWorkProtocol . $get_local_ip . '/' . 'work/gallery/uploadImages' : $netWorkProtocol . $_SERVER['HTTP_HOST'] . '/meiheng/pictrueDepot/uploadImages';

        $data = array(
            'sign' => $sign,
            'origin_url' => $imagePath . '/' . $imageName . '.' . $imageType,
            'thumbnail_url' => $imagePath . '/' . $imageName . '_thumb' . '.' . $imageType,
            'create_time' => date('Y-m-d H:i:s', time()),
            'origin_name' => $origin_name
        );

        $isInsert = $this->db->insert('picturedepot', $data);
        $resultJson = json_encode(array());
        if ($isInsert) {
            $resultJson = json_encode(array('code' => '1', 'msg' => '图片上传成功了', 'status' => 'done'));
        } else {
            $resultJson = json_encode(array('code' => '0', 'msg' => '存入数据库失败', 'status' => 'error'));
        }
        die($resultJson);
        // status
        // id
        // origin_url
        // thumbnail_url
        // desc
        // create_time
        // website_banner
        // origin_name
    }

    // 轮播头图的更换
    public function setSlideImage()
    {
        $files = $_FILES;
        $sign = $this->input->post('status');
        $id = $this->input->post('id');
        if (empty($files['image']) || empty($sign) || empty($id)) {
            $err_json = array('status' => '0', 'msg' => '数据没给齐全?', 'status' => 'error');
            die(json_encode($err_json));
        }

        // 比较图片 看看图片是否上传过
        // 待定
        // 占位符

        $image = $files['image'];
        $imageName = date('Y-m-d', time()) . '_' . $this->hash(20);
        $imageFile = $image['tmp_name'];
        // 上传前的名字
        $origin_name = $image['name'];
        $imageType = substr(strrchr($image['name'], '.'), 1);

        if (!file_exists($this->path())) {
            mkdir($this->path());
            chmod($this->path(), 0777);
        }


        $path = $this->path() . '/' . $imageName . '.' . $imageType;
        $uploadFileStatus = move_uploaded_file($imageFile, $path);

        if (!$uploadFileStatus) {
            $err_json = array(
                'code' => 0,
                'msg' => '图片没有保存到服务器中 请重新选择图片上传',
                'status' => 'error'
            );
            die(json_encode($err_json));
        }

        // 获取图片宽度与高度在存储成功后
        $width = getimagesize($path);
        $height = getimagesize($path);
        if (!empty($width)) {
            $width = $width[0];
        } else {
            $width = 300;
        }
        if (!empty($height)) {
            $height = $height[1];
        }
        $config['image_library'] = 'gd2';
        $config['source_image'] = $path;
        $config['create_thumb'] = true;
        $config['maintain_ratio'] = true;
        $config['quality'] = '30%';
        $config['thumb_marker'] = '_thumb';
        $config['width'] = $width / 3;
        $config['height'] = $height / 3;
        $this->load->library('image_lib', $config);
        $thumb = $this->image_lib->resize();
        if (!$this->image_lib->resize()) {
            echo $this->image_lib->display_errors();
        }

        $netWorkProtocol = $this->isHTTPS() ? 'https://' : 'http://';

        $get_local_ip = $this->get_local_ip();
        $imagePath = $this->develop() ? $netWorkProtocol . $get_local_ip . '/' . 'work/gallery/uploadImages' : $netWorkProtocol . $_SERVER['HTTP_HOST'] . '/meiheng/pictrueDepot/uploadImages';
        $imagePath = $imagePath . '/' . $imageName . '.' . $imageType;
        $aleryImage = $this->db->query('SELECT slidesImages FROM picturestatus WHERE sign =' . "'$sign'")->result_array();

        if (empty($aleryImage[0]['slidesImages'])) {
            $arr = json_encode(array($imagePath));
            $isInsert = $this->db->query('UPDATE picturestatus SET slidesImages=' . "'$arr'" . 'WHERE sign =' . "'$sign'");
            if (empty($isInsert)) {
                $err_json = array(
                    'code' => 0,
                    'msg' => '图片没有保存到数据库中 请重新选择图片上传',
                    'status' => 'error'
                );
                die(json_encode($err_json));
            }

            $res_json = array(
                'code' => 1,
                'msg' => '图片已经保存了',
                'status' => 'success',
                'data' => $arr
            );
            die(json_encode($res_json));
        }

        $slidesImages = json_decode($aleryImage[0]['slidesImages']);

        
        array_push($slidesImages, $imagePath);
        $slidesImages = json_encode($slidesImages);
        $insertSlidesImages = $this->db->query('UPDATE picturestatus SET slidesImages=' . "'$slidesImages'" . 'WHERE sign =' . "'$sign'");
        if (empty($insertSlidesImages)) {
            $err_json = array(
                'code' => 0,
                'msg' => '图片没有保存到数据库中 请重新选择图片上传',
                'status' => 'error'
            );
            die(json_encode($err_json));
        }
        $res_json = array(
            'code' => 1,
            'msg' => '图片已经保存了',
            'status' => 'success',
            'data' => $slidesImages
        );
        die(json_encode($res_json));
    }

    // 查询图库已有的轮播头图
    public function getSlideImage()
    {
        $sign = $this->input->get('status');
        if (empty($sign)) {
            $err_json = array('status' => '0', 'msg' => '数据没给齐全?', 'status' => 'error');
            die(json_encode($err_json));
        }
        $aleryImage = $this->db->query('SELECT slidesImages FROM picturestatus WHERE sign =' . "'$sign'")->result_array();

        if (empty($aleryImage[0]['slidesImages'])) {
            $res_json = array(
                'code' => 1,
                'msg' => '加载成功!',
                'status' => 'success',
                'data' => json_encode(array())
            );
            die(json_encode($res_json));
        }

        $res_json = array(
            'code' => 1,
            'msg' => '加载成功!',
            'status' => 'success',
            'data' => $aleryImage[0]['slidesImages']
        );
        die(json_encode($res_json));
    }

    // 查询可以上传多少张轮播图
    public function getMaxSlideNumber()
    {
        $sign = $this->input->get('sign');
        if (empty($sign)) {
            $err_json = array('status' => '0', 'msg' => '数据没给齐全?', 'status' => 'error');
            die(json_encode($err_json));
        }
        $maxSlideNumber = $this->db->query('SELECT maxSlideNumber FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
        $res_json = array(
            'code' => 1,
            'msg' => '加载成功!',
            'status' => 'success',
            'data' => $maxSlideNumber[0]['maxSlideNumber']
        );
        die(json_encode($res_json));
    }
 

    // 查看已有的图库有哪些
    public function existingGallery()
    {
        $result = $this->db->query("SELECT id,name,sign FROM picturestatus")->result_array();
        // for($i = 0; $i < count($result); $i++){
        //     print_r($result[$i]['name']);
        // }
        $resultJson = json_encode(array('data' => $result, 'code' => '1', 'msg' => '查询成功!'));
        die($resultJson);
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
        $result = $this->db->query('SELECT name,address,galleryDescribe,holdingTime FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
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

    // 删除头图
    public function deleteSlideImage()
    {
        $sign = $this->input->get('status');
        $index = $this->input->get('index');
        if (is_null($sign) || is_null($index)) {
            $errResult = array(
                'code' => 0,
                'msg' => '信息不全!',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }

        $aleryImage = $this->db->query('SELECT slidesImages FROM picturestatus WHERE sign =' . "'$sign'")->result_array();
        $aleryImage = @$aleryImage[0]["slidesImages"];
        if (empty($aleryImage)) {
            $errResult = array(
                'code' => 2,
                'msg' => '服务器数据错误!',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $aleryImage =json_decode($aleryImage);
        array_splice($aleryImage, $index, 1);
        
        $aleryImage = json_encode($aleryImage);
        $this->db->query('UPDATE picturestatus SET slidesImages=' . "'$aleryImage'" . 'WHERE sign =' . "'$sign'");
        $res = array(
            'code' => 1,
            'msg' => '已删除!',
            'status' => 'success'
        );
        die(json_encode($res));
    }

    // 修改对应图库的信息
    public function setGalleryInfo()
    {
        $sign = $this->input->post('status');
        $info = $this->input->post('info');
        if (empty($sign)) {
            $errResult = array(
                'code' => 0,
                'msg' => '你还没有对应选择图库！',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }

        $info = json_decode($info);
        $name = $info->name;
        $address = $info->address;
        $holdingTime = $info->holdingTime;
        $galleryDescribe = $info->galleryDescribe;
        $result = $this->db->query("UPDATE picturestatus SET name='{$name}', address='{$address}', holdingTime='{$holdingTime}', galleryDescribe='{$galleryDescribe}' WHERE sign = '{$sign}'");
        $dataResult = array(
            'code' => 1,
            'data' => $result,
            'status' => 'success'
        );
        die(json_encode($dataResult));
    }

    // 后台输出所属的图库的已上传图片
    public function getImageInfo()
    {
        $sign = $this->input->get('sign');
        if (empty($sign)) {
            $errResult = array(
                'code' => 0,
                'msg' => '你没选择图库!',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = $this->db->query('SELECT * FROM picturedepot WHERE sign =' . "'$sign'")->result_array();
        $dataResult = array(
            'code' => 1,
            'data' => $result,
            'status' => 'success'
        );
        die(json_encode($dataResult));
    }

    // 删除图库的图片
    public function deleteImage()
    {
        $sign = $this->input->get('sign');
        $id = $this->input->get('id');
        if (empty($sign) || empty($id)) {
            $errResult = array(
                'code' => 0,
                'msg' => '缺参数啊亲！',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }
        $result = $this->db->query('DELETE FROM picturedepot WHERE id =' . "'$id'");
        if (empty($result)) {
            $errResult = array(
                'code' => 0,
                'msg' => '图片没能成功删除！',
                'status' => 'error'
            );
            die(json_encode($errResult));
        }

        $errResult = array(
            'code' => 1,
            'msg' => '删除图片已删除！',
            'status' => 'error'
        );
        die(json_encode($errResult));
    }
}
