<template>
    <div class="video-wrap">
        <div class="video-content">
            <!-- <video class="video" x-webkit-airplay="true" webkit-playsinline="" playsinline="true" @click="pauseVideo" ref="videoRef" oncontextmenu="return true;" preload>
                <source :src="(videoUrl)" type="video/mp4"/>
            </video> -->
            <video class="video"  @click="pauseVideo" ref="videoRef"  preload>
                <source :src="(videoUrl)" type="video/mp4"/>
            </video>
        </div>
        <div class="play-btn" :class="{hide: isPlay}" @click="play">
            <span class="video-icon"></span>
        </div>
        <div class="title">{{title}}</div>
    </div>
</template>
<script>
export default {
    props: {
        videoUrl: {
            type: String
        },
        title: {
            type: String
        }
    },
    data() {
        return {
            isPlay: false
        };
    },
    methods: {
        play() {
            this.$refs.videoRef && this.$refs.videoRef.play();
            this.isPlay = true;
        },
        pauseVideo() {
            this.$refs.videoRef && this.$refs.videoRef.pause();
            this.isPlay = false;
        }
    },
    mounted() {}
};
</script>
<style lang="stylus" scoped>
.video-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .video-content {
        position: absolute;
        left: 30px;
        top: 40px;
        right: 30px
        bottom: 110px;
        .video {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .play-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background: url('../assets/img/video-play-icon@2x.png') no-repeat;
        background-position: center;
        background-size: 98px 98px;
        &.hide {
            display: none;
        }
        .video-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
        }
    }
    .title {
        position: absolute;
        width: 100%;
        height: 110px;
        left: 0;
        bottom: 0;
        background-color: transparent;
        z-index: 20;
        font-size: 30px;
        color: #B49165;
        padding-left: 30px;
        line-height: 110px;
    }
}
</style>