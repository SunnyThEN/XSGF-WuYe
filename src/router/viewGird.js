let viewgird = [
  {
    path: '/Sys_Log',
    name: 'sys_Log',
    component: () => import('@/views/sys/Sys_Log.vue')
  },
  {
    path: '/Sys_User',
    name: 'Sys_User',
    component: () => import('@/views/sys/Sys_User.vue')
  },
  {
    path: '/permission',
    name: 'permission',
    component: () => import('@/views/sys/Permission.vue')
  },

  {
    path: '/Sys_Dictionary',
    name: 'Sys_Dictionary',
    component: () => import('@/views/sys/Sys_Dictionary.vue')
  },
  {
    path: '/Sys_Role',
    name: 'Sys_Role',
    component: () => import('@/views/sys/Sys_Role.vue')
  },
  {
    path: '/Sys_Language',
    name: 'Sys_Language',
    component: () => import('@/views/sys/lang/Sys_Language.vue')
  },
  {
    path: '/Sys_DictionaryList',
    name: 'Sys_DictionaryList',
    component: () => import('@/views/sys/Sys_DictionaryList.vue')
  },
  {
    path: '/FormDesignOptions',
    name: 'FormDesignOptions',
    component: () => import('@/views/sys/form/FormDesignOptions.vue')
  },
  {
    path: '/FormCollectionObject',
    name: 'FormCollectionObject',
    component: () => import('@/views/sys/form/FormCollectionObject.vue')
  },
  {
    path: '/Sys_WorkFlow',
    name: 'Sys_WorkFlow',
    component: () => import('@/views/sys/flow/Sys_WorkFlow.vue')
  },
  {
    path: '/Sys_WorkFlowStep',
    name: 'Sys_WorkFlowStep',
    component: () => import('@/views/sys/flow/Sys_WorkFlowStep.vue')
  },
  {
    path: '/Sys_WorkFlowTable',
    name: 'Sys_WorkFlowTable',
    component: () => import('@/views/sys/flow/Sys_WorkFlowTable.vue')
  },
  {
    path: '/Sys_WorkFlowTableStep',
    name: 'Sys_WorkFlowTableStep',
    component: () => import('@/views/sys/flow/Sys_WorkFlowTableStep.vue')
  },
  {
    path: '/flowList',
    name: 'flowList',
    component: () => import('@/views/sys/flow/FlowList.vue')
  },
  {
    path: '/Sys_QuartzOptions',
    name: 'Sys_QuartzOptions',
    component: () => import('@/views/sys/quartz/Sys_QuartzOptions.vue')
  },
  {
    path: '/Sys_QuartzLog',
    name: 'Sys_QuartzLog',
    component: () => import('@/views/sys/quartz/Sys_QuartzLog.vue')
  },
  {
    path: '/Sys_Department',
    name: 'Sys_Department',
    component: () => import('@/views/sys/system/Sys_Department.vue')
  },
  {
    path: '/Sys_DbService',
    name: 'Sys_DbService',
    component: () => import('@/views/sys/db/Sys_DbService.vue')
  },
  {
    path: '/Sys_Group',
    name: 'Sys_Group',
    component: () => import('@/views/sys/group/Sys_Group.vue')
  },
  {
    path: '/Sys_Region',
    name: 'Sys_Region',
    component: () => import('@/views/sys/system/Sys_Region.vue')
  },
  {
    path: '/TestService',
    name: 'TestService',
    component: () => import('@/views/dbtest/test/TestService.vue')
  },
  {
    path: '/TestDb',
    name: 'TestDb',
    component: () => import('@/views/dbtest/test/TestDb.vue')
  },
  {
    path: '/Demo_Order',
    name: 'Demo_Order',
    component: () => import('@/views/dbtest/order/Demo_Order.vue')
  },
  {
    path: '/Demo_Order/edit',
    name: 'Demo_Order_edit',
    component: () => import('@/views/dbtest/order/Demo_OrderWindow/Edit.vue'),
    meta: {
      name: '订单管理窗口模式',
      edit: true,
      keepAlive: false
    }
  },
  {
    path: '/Demo_Catalog',
    name: 'Demo_Catalog',
    component: () => import('@/views/dbtest/catalog/Demo_Catalog.vue')
  },
  {
    path: '/Demo_Customer',
    name: 'Demo_Customer',
    component: () => import('@/views/dbtest/customer/Demo_Customer.vue')
  },
  {
    path: '/Demo_CustomerMap',
    name: 'Demo_CustomerMap',
    component: () => import('@/views/dbtest/customer/Demo_CustomerMap.vue')
  },
  {
    path: '/Demo_Goods',
    name: 'Demo_Goods',
    component: () => import('@/views/dbtest/goods/Demo_Goods.vue')
  },
  {
    path: '/Demo_GoodsTree',
    name: 'Demo_GoodsTree',
    component: () => import('@/views/dbtest/goods/Demo_GoodsTree.vue')
  },
  {
    path: '/Demo_GoodsMerge',
    name: 'Demo_GoodsMerge',
    component: () => import('@/views/dbtest/goods/Demo_GoodsMerge.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/Demo_Product',
    name: 'Demo_Product',
    component: () => import('@/views/dbtest/product/Demo_Product.vue')
  },
  {
    path: '/Demo_Product2',
    name: 'Demo_Product2',
    component: () => import('@/views/dbtest/product/Demo_Product2.vue')
  },
  {
    path: '/Demo_ProductSize',
    name: 'Demo_ProductSize',
    component: () => import('@/views/dbtest/product/Demo_ProductSize.vue')
  },
  {
    path: '/Demo_ProductColor',
    name: 'Demo_ProductColor',
    component: () => import('@/views/dbtest/product/Demo_ProductColor.vue')
  },
  {
    path: '/Demo_Goods/edit',
    name: 'Demo_Goods_edit',
    component: () => import('@/views/dbtest/goods/Demo_Goods/Edit.vue'),
    meta: {
      name: '商品信息',
      edit: true,
      keepAlive: false
    }
  },
  {
    path: '/Sys_PrintOptions',
    name: 'Sys_PrintOptions',
    component: () => import('@/views/sys/system/Sys_PrintOptions.vue')
  },
  {
    path: '/Sys_ReportOptions',
    name: 'Sys_ReportOptions',
    component: () => import('@/views/sys/system/Sys_ReportOptions.vue')
  },
  {
    path: '/Sys_Dashboard',
    name: 'Sys_Dashboard',
    component: () => import('@/views/sys/dashboard/Sys_Dashboard.vue')
  },
  {
    path: '/DashboardEdit', //工作台设计
    name: 'DashboardEdit',
    component: () => import('@/views/sys/dashboard/DashboardEdit.vue'),
    meta: {
      name: '工作台',
      keepAlive: false
    }
  },
  {
    path: '/DashboardPreview',//工作台预览
    name: 'DashboardPreview',
    component: () => import('@/views/sys/dashboard/DashboardPreview.vue'),
    meta: {
      dynamic: true,
      // keepAlive:false
    }
  },
  {
    path: '/Sys_CodeRule',
    name: 'Sys_CodeRule',
    component: () => import('@/views/sys/rule/Sys_CodeRule.vue')
  }
  , {
    path: '/Sys_Post', 
    name: 'Sys_Post',
    component: () => import('@/views/sys/system/Sys_Post.vue')
  }    ,{
        path: '/Demo_Product/edit',
        name: 'Demo_Product_edit',
        component: () => import('@/views/dbtest/product/Demo_Product/Edit.vue'),
        meta:{
              name:"产品管理",
              edit:true,
              keepAlive:false
            }
    }    ,{
        path: '/RMS_PropertyDetails',
        name: 'RMS_PropertyDetails',
        component: () => import('@/views/rms/rms_propertydetails/RMS_PropertyDetails.vue')
    }    ,{
        path: '/RMS_OwnerDetails',
        name: 'RMS_OwnerDetails',
        component: () => import('@/views/rms/rms_ownerdetails/RMS_OwnerDetails.vue')
    }    ,{
        path: '/RMS_VacantRoom',
        name: 'RMS_VacantRoom',
        component: () => import('@/views/rms/rms_vacantroom/RMS_VacantRoom.vue')
    }    ,{
        path: '/RMS_PaymentDetails',
        name: 'RMS_PaymentDetails',
        component: () => import('@/views/rms/rms_paymentdetails/RMS_PaymentDetails.vue')
    }    ,{
        path: '/RMS_ApplicationForm',
        name: 'RMS_ApplicationForm',
        component: () => import('@/views/rms/rms_applicationform/RMS_ApplicationForm.vue')
    }    ,{
        path: '/RMS_ElectricityBillDetails',
        name: 'RMS_ElectricityBillDetails',
        component: () => import('@/views/rms/rms_electricitybilldetails/RMS_ElectricityBillDetails.vue')
    }]

export default viewgird
