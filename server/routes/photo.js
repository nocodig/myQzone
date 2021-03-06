let express = require('express');
let router = express.Router();
let User = require('../models/user');
let PhotoList = require('../models/photoList');
let verify = require('../utils/token');
let multiparty = require('multiparty');
let data = require('../utils/data');
let Photo = require('../models/photo');

router.post('/upload', (req, res) => {
  const user = verify(req.cookies.token);
  if(user){
    let form = new multiparty.Form({
      uploadDir: './public/photos'
    });
    form.parse(req, (err, fields, files) => {
      if(err){
        console.log('parse err:'+err);
      }else{
        console.log(files);
        let inputFile = files.file[0];
        let uploadedPath = inputFile.path;
        let filename = uploadedPath.split('//');
        inputFile.originalFilename = uploadedPath.split('\\')[2];
        let dstpath = `/api/photos/${inputFile.originalFilename}`;
        res.json(data({
          flag: true,
          data: dstpath
        }))
      }
    })
  }else{
    res.json(data({
      flag: 200,
      message: 'token过期，请重新登录'
    }))
  }
})

router.post('/addList', (req, res) => {
  let user = verify(req.cookies.token);
  if (user) {
    let photoList = {
      user_id: user,
      title: req.body.title,
      _id: req.body.id
    };
    if (photoList._id) {
      PhotoList.findOne({
        _id: photoList._id
      }).exec((err, doc) => {
        doc.title = photoList.title;
        doc.save();
        res.json(data({
          flag: true,
          message: '修改成功'
        }))
      })
    } else {
      let photoListInsert = new PhotoList({
        user_id: user,
        title: photoList.title
      });
      photoListInsert.save();
      res.json(data({
        flag: true,
        message: '创建完成'
      }))
    }
  } else {
    res.json(data({
      flag: false,
      message: 'token过期，请重新登录'
    }))
  }
})

router.post('/getList', (req, res) => {
  const user = verify(req.cookies.token);
  if (user) {
    PhotoList.find({
      user_id: user,
      is_remove: 0
    }).exec((err, doc) => {
      if (doc.length > 0) {
        res.json(data({
          flag: true,
          data: doc
        }))
      } else {
        res.json(data({
          flag: true,
          message: '没有相关信息'
        }))
      }
    })
  } else {
    res.json(data({
      flag: false,
      message: 'token过期，请重新登录'
    }))
  }
})

router.post('/delList', (req, res) => {
  const user = verify(req.cookies.token);
  if (user) {
    PhotoList.findOne({
      _id: req.body.id,
      is_remove: 0
    }).exec((err, doc) => {
      doc.is_remove = 1;
      doc.save();
      res.json(data({
        flag: true,
        message: '删除成功'
      }))
    })
  } else {
    res.json(data({
      flag: false,
      message: 'token过期，请重新登录'
    }))
  }
})

router.post('/submitData',(req,res)=>{
  const user = verify(req.cookies.token);
  if(user){
    req.body.data.forEach(item => {
      let info = {
        photo_path: item,
        photo_list_id: req.body.id
      };
      PhotoList.findOne({
        _id: info.photo_list_id
      },(err,doc)=>{
        ++doc.photo_num;
        doc.save();
      })
      const mongoInsert = new Photo(info);
      mongoInsert.save();
    });
    res.json(data({
      flag: true,
      message: '上传成功'
    }))
  }else{
    res.json(data({
      flag: false,
      message: 'token过期，请重新登录'
    }))
  }
})

router.get('/getpic',(req,res)=>{
  const user = verify(req.cookies.token);
  if(user){
    Photo.find({
      photo_list_id: req.query._id,
      is_remove: 0
    }).exec((err,doc)=>{
      if(doc.length>0){
        res.json(data({
          flag: true,
          data: doc
        }))
      }else{
        res.json(data({
          flag: true,
          message: '没有数据'
        }))
      }
    })
  }else{
    res.json(data({
      flag: false,
      message: 'token过期，请重新登录'
    }))
  }
})

router.post('/delpic',(req,res)=>{
  const user = verify(req.cookies.token);
  if(user){
    let dataList = req.body.photoList.map(item=>{
      return {_id: item}
    });
    Photo.find({
      $or: dataList
    }).exec((err,doc)=>{
      doc.forEach(item=>{
        item.is_remove = 1;
        item.save();
      });
      res.json(data({
        flag: true,
        message: '删除成功'
      }))
    })
  }else{
    req.json(data({
      flag:false,
      message: 'token过期，请重新登录'
    }))
  }
})


module.exports = router;
