import {
  verify
} from '../../components/utils/verify';

let dynamic = {
    props: {
        msg:{
            type:String
        },
        name: {
            type:String
        },
        goodNum: {
            type:Number,
            default: 0,
        },
        id: {

        }
    },
    data () {
        return {
            rows: 1,
            subFlage: false,
            replyFlage: false,
            niceNum: this.goodNum,
            commentFlag: false,
        }
    },
    methods: {
        /**
         * 评论框获取焦点时，改变显示状态
         */
        showStatus() {
            this.rows = 3;
            this.subFlage = true;
        },
        /**
         * 回复时输入框状态
         */
        replyStatus() {
            if(this.replyFlage) {
                this.rows = 1;
                this.replyFlage = false;
                this.subFlage = false;
            }
        },
        /**
         * 点赞功能
         */
        touchNice() {
           this.$emit('good');
        },
        delonly(){
           this.$emit('del');
        },
        comment(){
            this.$emit('comment')
        }

    }
}

export { dynamic }