<template>
    <div class="header-container">
        <div class="header-logo" @click="linkTo('/')"></div>
        <ul class="menu-list">
            <li :class="{active: item.id === currentPath}" @click="linkTo(item.path)" v-for="item in menuList" :key="item.id">{{item.text}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
        };
    },
    computed: {
        currentPath() {
            return this.$route.name;
        },
        menuList() {
            return [
                {
                    text: this.$t('exchange'),
                    path: '/exchange',
                    id: 'exchange'
                },
                {
                    text: this.$t('match'),
                    path: '/match',
                    id: 'match'
                },
                {
                    text: this.$t('culture'),
                    path: '/culture',
                    id: 'culture'
                }
            ];
        }
    },
    methods: {
        linkTo(path) {
            if (path === '/' + this.currentPath) {
                return;
            } else if (this.currentPath === 'home' && path === '/') {
                return;
            } else {
                this.$router.push(path);
            }
        }
    },
    mounted() {
    }
};
</script>
<style lang="stylus" scoped>
.header-container {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 140px;
    padding: 0 70px 0 40px;
    background-color: #B1353D;
    background-image: url(../assets/img/head-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;
    .header-logo {
        width: 120px;
        height: 100%;
        cursor: pointer;
        background-color: #fff;
        background-image: url(../assets/img/logo@2x.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .menu-list {
        display: flex;
        li {
            position: relative;
            font-size: 36px;
            cursor: pointer;
            color: #fff;
            font-weight: 500;
            margin-left: 50px;
            &:first-child {
                margin-left: 0;
            }
            &.active {
                &::after {
                    content: '';
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    transition: all 0.3s linear;
                    background-color: #FAD8A4;
                    bottom: -29px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
</style>