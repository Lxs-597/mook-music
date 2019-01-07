<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrap">
        <div class="confirm-content">
          <p class="m-text">{{ info }}</p>
          <div class="operators">
            <div @click="confirm" class="operate-btn left">{{ confirmBtnText }}</div>
            <div @click="cancel" class="operate-btn">{{ cancelBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    info: {
      type: String,
      default: '提示信息'
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, .6);
    &.confirm-fade-enter-active {
      animation: confirm-fadeIn 0.3s;
      .confirm-content {
        animation: confirm-zoomIn 0.3s
      }
    }
    &.confirm-fade-leave-to {
      animation: confirm-fadeOut 0.3s;
      .confirm-content {
        animation: confirm-zoomOut 0.3s
      }
    }
    .confirm-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 29;
    }
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: rgba($color-bg-hl, .8);
      .m-text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $size-bg;
        color: $color-text-l;
      }
      .operators {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $size-bg;
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid rgba($color-bg, .5);
          color: $color-text-d;
          &.left {
            border-right: 1px solid rgba($color-bg, .5);
          }
        }
      }
    }
  }

@keyframes confirm-fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-zoomIn {
  0% {
    transform: scale(0)
  }
  50% {
    transform: scale(1.1)
  }
  100% {
    transform: scale(1)
  }
}
@keyframes confirm-fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes confirm-zoomOut {
  0% {
    transform: scale(1)
  }
  100% {
    transform: scale(0)
  }
}
</style>


