export default function(){
        const editFormFields = {"GoodsName":"","CatalogId":[],"GoodsCode":"","Price":"","Remark":"","Img":""};
        const editFormOptions = [[{"title":"商品名称","required":true,"field":"GoodsName","type":"text"}],
                              [{"dataKey":"分类级联","data":[],"title":"所属分类","field":"CatalogId","type":"cascader"}],
                              [{"title":"商品编号","required":true,"field":"GoodsCode","type":"text"}],
                              [{"title":"单价","required":true,"field":"Price","type":"decimal"}],
                              [{"title":"备注","field":"Remark","colSize":12,"type":"textarea"}],
                              [{"title":"商品图片","field":"Img","type":"img"}]];
        const tableName="Demo_Goods";
        const tableCNName="商品信息";
        const newTabEdit=true;
        const key='GoodsId';
        const detail = {
            cnName: "",
            table: "",
            url:"api/Demo_Goods/getDetailPage",
            columns: [],
            sortName: "",
            key: ""
        };

       const details=[]

    return {
        key,
        tableName,
        tableCNName,
        editFormFields,
        editFormOptions,
        detail,
        details,
        newTabEdit
    }
}