module.exports = {
  commen: {
    edit: "修改",
    delete : "删除",
    add: "添加",
    list: "列表",
    prev: "上一页",
    next: "下一页",
    success: "操作成功",
    fail: "网络错误",
    modal: {
      btn_ok: "确定",
      btn_cancel: "取消"
    }
  },

  login: {
    title: "登录",
    tips: "输入您的用户名和密码",
    placeholder: {
      username: "用户名/手机号",
      password: "密码"
    },
    loginBtn: "登录"
  },

  active: {
    banner: {
      title: '封面图',
      tables: {
        id: "编号",
        title: "主题",
        img_title: "封面图片",
        gmt_create: "创建时间",
        gmt_begin: "开始时间",
        gmt_end: "结束时间",
        weight: "排序权重",
        setting: "操作"
      },

      modal: {
        title: "主题",
        weight: "排序权重",
        url: "跳转地址",
        gmt_begin: "开始时间",
        gmt_end: "结束时间",
        upload_label: "上传图片",
        btn_upload: "上传",
        btn_ok: "确定",
        btn_cancel: "取消",
        comfirm_text : "是否确认删除这个封面图？"
      }
    }
  },

  cms: {
    nav: {
      title: "导航",
      tables: {
        title: "导航标题(中文)",
        title_en: "导航标题(英文)",
        des_title: "副标题(中文)",
        des_title_en: "副标题(英文)",
        gmt_create: "创建时间",
        url: "跳转地址",
        weight: "排序权重",
        setting: "操作",
        preview: "预览"
      },

      modal: {
        title: "导航标题(中文)",
        title_en: "导航标题(英文)",
        des_title: "副标题(中文)",
        des_title_en: "副标题(英文)",
        weight: "排序权重",
        url: "跳转地址",
        comfirm_text : "是否确认删除这个导航？"

      }
    },

    about: {
      title: "关于我们",
      introduction: "企业简介",
      content: "中文内容",
      content_en: "英文内容",
      btn_save: "保存",
      product_title: "产品展示",
      image_title: "图片",
      contact_title: "联系信息",
      tel: "电话",
      email: "邮箱",
      address:"地址",
      address_en:"地址(英文)",
      tables: {
        imgUrl: "图片",
        setting: "操作"
      },

      modal: {
        upload_label: "上传图片",
        btn_upload: "上传",
        comfirm_text: "是否确认删除这个图片？"
      }
    },

    business: {
      title: "所属领域",
      tables: {
        title: "导航标题(中文)",
        title_en: "导航标题(英文)",
        gmt_create: "创建时间",
        url: "跳转地址",
        weight: "排序权重",
        setting: "操作",
        preview: "预览"
      },

      modal: {
        title: "导航标题(中文)",
        title_en: "导航标题(英文)",
        weight: "排序权重",
        url: "跳转地址",
        comfirm_text : "是否确认删除这个所属领域？"
      }
    },

    enterprises: {
      title: "下属企业",
      select_business: "选择所属领域",
      tables: {
        name: "企业名称(中文)",
        name_en: "企业名称(英文)",
        business_id: "所属领域",
        url: "跳转地址",
        setting: "操作",
        preview: "预览",
        edit_content: "编辑内容"
      },

      modal: {
        name: "企业名称(中文)",
        name_en: "企业名称(英文)",
        business_id: "所属领域",
        url: "跳转地址",
        comfirm_text : "是否确认删除这个企业？"
      }
    },

    entDetail: {
      title: "下属企业",
      introduction: "企业简介",
      content: "中文内容",
      content_en: "英文内容",
      btn_save: "保存",
      product_title: "产品展示",
      image_title: "图片",
      contact_title: "联系信息",
      tel: "电话",
      email: "邮箱",
      address:"地址",
      address_en:"地址(英文)",
      tables: {
        imgUrl: "图片",
        setting: "操作"
      },

      modal: {
        upload_label: "上传图片",
        btn_upload: "上传",
        comfirm_text: "是否确认删除这个图片？"
      }
    }
  },

  news: {
    title: "文章管理",
    typeArray: {
      news: "公司信息",
      notice: "公告通知",
      community: "党建之家"
    },
    tables: {
      title: "标题(中文)",
      title_en: "标题(英文)",
      imgurl: "封面图",
      url: "预览内容",
      group_type: "所属分类",
      gmt_create: "创建时间",
      setting: "操作"
    },

    modal: {
      title: "标题(中文)",
      title_en: "标题(英文)",
      imgurl: "封面图",
      content: "中文内容",
      content_en: "英文内容",
      upload_label: "上传图片",
      btn_upload: "上传",
      comfirm_text : "是否确认删除这个文章？"
    }
  },

  product: {
    brand: {
      title: "品牌",
      tables: {
        brand_name: "品牌名称(中文)",
        brand_name_en: "品牌名称(英文)",
        count: "商品数",
        setting: "操作"
      },

      modal: {
        brand_name: "品牌名称(中文)",
        brand_name_en: "品牌名称(英文)",
        comfirm_text : "是否确认删除这个品牌？"
      }
    },

    classify: {
      title: "分类",
      tables: {
        classify_name: "分类名称(中文)",
        classify_name_en: "分类名称(英文)",
        count: "商品数",
        setting: "操作"
      },

      modal: {
        classify_name: "分类名称(中文)",
        classify_name_en: "分类名称(英文)",
        comfirm_text : "是否确认删除这个分类？"
      }
    },

    product: {
      title: "产品",
      tables: {
        product_name: "产品名称(中文)",
        product_name_en: "产品名称(英文)",
        brand: "品牌",
        classify: "分类",
        url: "预览地址",
        setting: "操作"
      },

      modal: {
        product_name: "产品名称(中文)",
        product_name_en: "产品名称(英文)",
        brand: "品牌",
        classify: "分类",
        chooseBrand: "选择品牌",
        chooseClassify: "选择分类",
        imgurl: "封面图",
        content: "中文内容",
        content_en: "英文内容",
        upload_label: "上传图片",
        btn_upload: "上传",
        comfirm_text : "是否确认删除这个产品？"
      }
    }
  },

  talents: {
    title: "招聘信息",
    tables: {
      jobs: "招聘标题(中文)",
      jobs_en: "招聘标题(英文)",
      number: "招聘人数",
      job_exp: "工作经验",
      address: "工作地址(中文)",
      address_en: "工作地址(英文)",
      gmt_end: "截止时间",
      setting: "操作"
    },

    modal: {
      jobs: "招聘标题(中文)",
      jobs_en: "招聘标题(英文)",
      number: "招聘人数",
      job_exp: "工作经验(单位/年，0为不限制)",
      address: "工作地址(中文)",
      address_en: "工作地址(英文)",
      gmt_end: "截止时间",
      content: "中文内容",
      content_en: "英文内容",
      comfirm_text : "是否确认删除这个招聘？"
    }
  },

  password: {
    title: "密码管理",
    o_password: "原密码",
    password: "新密码",
    c_password: "确认密码",
    btn_save: "保存"
  }
};
