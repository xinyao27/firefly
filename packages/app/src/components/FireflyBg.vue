<template>
  <div
    v-for="i in 16"
    :key="i"
    class="firefly"
  />
</template>

<style scoped lang="sass">
$yellow: #985c02

.firefly
  position: fixed
  left: 50%
  top: 50%
  width: .6vw
  height: .6vw
  margin: calc(-2vw / 10) 0 0 calc(.98 * 10)
  animation: ease 200s alternate infinite
  pointer-events: none

.firefly::before, .firefly::after
  content: ""
  position: absolute
  width: 100%
  height: 100%
  border-radius: 50%
  transform-origin: -10vw

.firefly::before
  background: $yellow
  opacity: .3
  animation: drift ease alternate infinite

.firefly::after
  background: $yellow
  opacity: 0
  box-shadow: 0 0 0vw 0vw $yellow
  animation: drift ease alternate infinite, flash ease infinite

.firefly:nth-child(1)
  animation-name: move1

.firefly:nth-child(1)::before
  animation-duration: 10s

.firefly:nth-child(1)::after
  animation-duration: 10s, 6692ms
  animation-delay: 0ms, 5414ms

@keyframes move1
  0%
    transform: translateX(-16vw) translateY(-35vh) scale(.98)

  6%
    transform: translateX(-45vw) translateY(-35vh) scale(.66)

  12%
    transform: translateX(19vw) translateY(30vh) scale(.6)

  18%
    transform: translateX(8vw) translateY(-23vh) scale(.41)

  24%
    transform: translateX(11vw) translateY(-46vh) scale(.78)

  29%
    transform: translateX(-9vw) translateY(18vh) scale(.99)

  35%
    transform: translateX(-1vw) translateY(4vh) scale(.74)

  41%
    transform: translateX(-36vw) translateY(-38vh) scale(.89)

  47%
    transform: translateX(-28vw) translateY(29vh) scale(.98)

  53%
    transform: translateX(-12vw) translateY(50vh) scale(.94)

  59%
    transform: translateX(20vw) translateY(-30vh) scale(.51)

  65%
    transform: translateX(39vw) translateY(-39vh) scale(.51)

  8%
    transform: translateX(46vw) translateY(-25vh) scale(.7)

  76%
    transform: translateX(-23vw) translateY(-19vh) scale(.54)

  82%
    transform: translateX(7vw) translateY(42vh) scale(.93)

  88%
    transform: translateX(26vw) translateY(17vh) scale(.39)

  94%
    transform: translateX(23vw) translateY(13vh) scale(.62)

  100%
    transform: translateX(-30vw) translateY(-1vh) scale(.5)

.firefly:nth-child(2)
  animation-name: move2

.firefly:nth-child(2)::before
  animation-duration: 16s

.firefly:nth-child(2)::after
  animation-duration: 16s, 6024ms
  animation-delay: 0ms, 4389ms

@keyframes move2
  0%
    transform: translateX(31vw) translateY(22vh) scale(.43)

  4%
    transform: translateX(-24vw) translateY(-9vh) scale(.98)

  8%
    transform: translateX(-6vw) translateY(-22vh) scale(.52)

  12%
    transform: translateX(40vw) translateY(47vh) scale(.8)

  15%
    transform: translateX(10vw) translateY(19vh) scale(.4)

  19%
    transform: translateX(-6vw) translateY(12vh) scale(.63)

  23%
    transform: translateX(11vw) translateY(-16vh) scale(.69)

  27%
    transform: translateX(-20vw) translateY(50vh) scale(.31)

  4%
    transform: translateX(-23vw) translateY(17vh) scale(.55)

  35%
    transform: translateX(4vw) translateY(-20vh) scale(.53)

  38%
    transform: translateX(42vw) translateY(-15vh) scale(.66)

  42%
    transform: translateX(-11vw) translateY(15vh) scale(.59)

  46%
    transform: translateX(31vw) translateY(37vh) scale(.58)

  50%
    transform: translateX(6vw) translateY(38vh) scale(.75)

  54%
    transform: translateX(1vw) translateY(18vh) scale(.47)

  58%
    transform: translateX(2vw) translateY(-20vh) scale(.47)

  62%
    transform: translateX(46vw) translateY(-8vh) scale(.46)

  65%
    transform: translateX(-10vw) translateY(7vh) scale(.47)

  69%
    transform: translateX(-14vw) translateY(-11vh) scale(.45)

  73%
    transform: translateX(-43vw) translateY(12vh) scale(.8)

  77%
    transform: translateX(-11vw) translateY(44vh) scale(.27)

  9%
    transform: translateX(13vw) translateY(49vh) scale(.49)

  85%
    transform: translateX(5vw) translateY(-48vh) scale(.28)

  88%
    transform: translateX(44vw) translateY(5vh) scale(.47)

  92%
    transform: translateX(-46vw) translateY(-21vh) scale(.45)

  96%
    transform: translateX(48vw) translateY(-10vh) scale(.81)

  100%
    transform: translateX(-3vw) translateY(-24vh) scale(.4)

.firefly:nth-child(3)
  animation-name: move3

.firefly:nth-child(3)::before
  animation-duration: 17s

.firefly:nth-child(3)::after
  animation-duration: 17s, 6599ms
  animation-delay: 0ms, 6686ms

@keyframes move3
  0%
    transform: translateX(-13vw) translateY(-3vh) scale(.87)

  4%
    transform: translateX(6vw) translateY(-32vh) scale(.54)

  9%
    transform: translateX(-3vw) translateY(-37vh) scale(.63)

  13%
    transform: translateX(28vw) translateY(17vh) scale(.96)

  17%
    transform: translateX(-30vw) translateY(6vh) scale(.98)

  22%
    transform: translateX(-36vw) translateY(-26vh) scale(.59)

  26%
    transform: translateX(-38vw) translateY(49vh) scale(.8)

  3%
    transform: translateX(-4vw) translateY(-18vh) scale(.94)

  35%
    transform: translateX(30vw) translateY(-7vh) scale(1)

  39%
    transform: translateX(-42vw) translateY(32vh) scale(.79)

  43%
    transform: translateX(-19vw) translateY(-14vh) scale(.35)

  48%
    transform: translateX(-17vw) translateY(42vh) scale(.45)

  52%
    transform: translateX(-37vw) translateY(13vh) scale(.26)

  57%
    transform: translateX(-29vw) translateY(-12vh) scale(.33)

  7%
    transform: translateX(-10vw) translateY(0vh) scale(.91)

  65%
    transform: translateX(36vw) translateY(8vh) scale(.31)

  70%
    transform: translateX(-14vw) translateY(-16vh) scale(.45)

  74%
    transform: translateX(-12vw) translateY(-44vh) scale(.93)

  78%
    transform: translateX(-14vw) translateY(44vh) scale(.46)

  83%
    transform: translateX(37vw) translateY(-44vh) scale(.58)

  87%
    transform: translateX(25vw) translateY(40vh) scale(.72)

  91%
    transform: translateX(-38vw) translateY(34vh) scale(.92)

  96%
    transform: translateX(18vw) translateY(21vh) scale(.68)

  100%
    transform: translateX(-39vw) translateY(46vh) scale(.81)

.firefly:nth-child(4)
  animation-name: move4

.firefly:nth-child(4)::before
  animation-duration: 17s

.firefly:nth-child(4)::after
  animation-duration: 17s, 10507ms
  animation-delay: 0ms, 6149ms

@keyframes move4
  0%
    transform: translateX(28vw) translateY(-14vh) scale(1)

  4%
    transform: translateX(4vw) translateY(7vh) scale(.41)

  8%
    transform: translateX(25vw) translateY(-14vh) scale(.66)

  12%
    transform: translateX(-15vw) translateY(15vh) scale(.57)

  15%
    transform: translateX(-31vw) translateY(10vh) scale(.33)

  19%
    transform: translateX(33vw) translateY(-24vh) scale(.31)

  23%
    transform: translateX(46vw) translateY(26vh) scale(.63)

  27%
    transform: translateX(-22vw) translateY(9vh) scale(.65)

  4%
    transform: translateX(-37vw) translateY(19vh) scale(.98)

  35%
    transform: translateX(40vw) translateY(44vh) scale(.58)

  38%
    transform: translateX(34vw) translateY(0vh) scale(.41)

  42%
    transform: translateX(8vw) translateY(-28vh) scale(.83)

  46%
    transform: translateX(14vw) translateY(-7vh) scale(.66)

  50%
    transform: translateX(33vw) translateY(29vh) scale(.35)

  54%
    transform: translateX(-7vw) translateY(-25vh) scale(.35)

  58%
    transform: translateX(11vw) translateY(45vh) scale(.33)

  62%
    transform: translateX(-16vw) translateY(-11vh) scale(.79)

  65%
    transform: translateX(-13vw) translateY(-39vh) scale(.97)

  69%
    transform: translateX(25vw) translateY(26vh) scale(.63)

  73%
    transform: translateX(-19vw) translateY(11vh) scale(.7)

  77%
    transform: translateX(49vw) translateY(-8vh) scale(.64)

  9%
    transform: translateX(23vw) translateY(-43vh) scale(.4)

  85%
    transform: translateX(-14vw) translateY(16vh) scale(.55)

  88%
    transform: translateX(36vw) translateY(25vh) scale(.54)

  92%
    transform: translateX(43vw) translateY(-45vh) scale(.79)

  96%
    transform: translateX(15vw) translateY(-1vh) scale(.95)

  100%
    transform: translateX(16vw) translateY(22vh) scale(.4)

.firefly:nth-child(5)
  animation-name: move5

.firefly:nth-child(5)::before
  animation-duration: 11s

.firefly:nth-child(5)::after
  animation-duration: 11s, 5508ms
  animation-delay: 0ms, 4542ms

@keyframes move5
  0%
    transform: translateX(37vw) translateY(-3vh) scale(.88)

  4%
    transform: translateX(35vw) translateY(-1vh) scale(.85)

  8%
    transform: translateX(-45vw) translateY(42vh) scale(.73)

  12%
    transform: translateX(-41vw) translateY(38vh) scale(.69)

  15%
    transform: translateX(-42vw) translateY(-4vh) scale(.39)

  19%
    transform: translateX(38vw) translateY(38vh) scale(.56)

  23%
    transform: translateX(7vw) translateY(27vh) scale(.44)

  27%
    transform: translateX(25vw) translateY(-45vh) scale(.36)

  4%
    transform: translateX(-3vw) translateY(-40vh) scale(.88)

  35%
    transform: translateX(13vw) translateY(-5vh) scale(.44)

  38%
    transform: translateX(-5vw) translateY(-43vh) scale(.66)

  42%
    transform: translateX(-6vw) translateY(48vh) scale(.52)

  46%
    transform: translateX(34vw) translateY(32vh) scale(.45)

  50%
    transform: translateX(-35vw) translateY(-46vh) scale(.33)

  54%
    transform: translateX(-42vw) translateY(-44vh) scale(.91)

  58%
    transform: translateX(15vw) translateY(42vh) scale(.78)

  62%
    transform: translateX(-41vw) translateY(16vh) scale(.76)

  65%
    transform: translateX(13vw) translateY(25vh) scale(.33)

  69%
    transform: translateX(44vw) translateY(-29vh) scale(.39)

  73%
    transform: translateX(35vw) translateY(-4vh) scale(.45)

  77%
    transform: translateX(46vw) translateY(19vh) scale(.29)

  9%
    transform: translateX(35vw) translateY(2vh) scale(.94)

  85%
    transform: translateX(50vw) translateY(0vh) scale(.4)

  88%
    transform: translateX(-5vw) translateY(-29vh) scale(.42)

  92%
    transform: translateX(-33vw) translateY(-12vh) scale(.81)

  96%
    transform: translateX(50vw) translateY(16vh) scale(.53)

  100%
    transform: translateX(26vw) translateY(-24vh) scale(.71)

.firefly:nth-child(6)
  animation-name: move6

.firefly:nth-child(6)::before
  animation-duration: 12s

.firefly:nth-child(6)::after
  animation-duration: 12s, 9757ms
  animation-delay: 0ms, 6153ms

@keyframes move6
  0%
    transform: translateX(41vw) translateY(17vh) scale(.33)

  5%
    transform: translateX(-20vw) translateY(8vh) scale(.32)

  9%
    transform: translateX(-18vw) translateY(15vh) scale(.41)

  14%
    transform: translateX(0vw) translateY(10vh) scale(.49)

  28%
    transform: translateX(-2vw) translateY(1vh) scale(.43)

  23%
    transform: translateX(6vw) translateY(22vh) scale(.64)

  27%
    transform: translateX(12vw) translateY(3vh) scale(.94)

  32%
    transform: translateX(13vw) translateY(41vh) scale(1)

  36%
    transform: translateX(-34vw) translateY(45vh) scale(.42)

  5%
    transform: translateX(24vw) translateY(30vh) scale(.56)

  45%
    transform: translateX(-3vw) translateY(-2vh) scale(.6)

  50%
    transform: translateX(7vw) translateY(5vh) scale(.96)

  55%
    transform: translateX(5vw) translateY(-20vh) scale(.91)

  59%
    transform: translateX(33vw) translateY(-17vh) scale(.51)

  64%
    transform: translateX(45vw) translateY(17vh) scale(.75)

  68%
    transform: translateX(-13vw) translateY(26vh) scale(.75)

  73%
    transform: translateX(-9vw) translateY(12vh) scale(.26)

  77%
    transform: translateX(31vw) translateY(-23vh) scale(.72)

  82%
    transform: translateX(-40vw) translateY(36vh) scale(.38)

  86%
    transform: translateX(0vw) translateY(22vh) scale(.44)

  19%
    transform: translateX(39vw) translateY(-25vh) scale(.55)

  95%
    transform: translateX(-13vw) translateY(1vh) scale(.57)

  100%
    transform: translateX(-4vw) translateY(-13vh) scale(.44)

.firefly:nth-child(7)
  animation-name: move7

.firefly:nth-child(7)::before
  animation-duration: 11s

.firefly:nth-child(7)::after
  animation-duration: 11s, 6491ms
  animation-delay: 0ms, 7889ms

@keyframes move7
  0%
    transform: translateX(-24vw) translateY(-25vh) scale(.79)

  6%
    transform: translateX(-2vw) translateY(10vh) scale(.82)

  11%
    transform: translateX(-5vw) translateY(10vh) scale(.94)

  17%
    transform: translateX(29vw) translateY(5vh) scale(.75)

  22%
    transform: translateX(-5vw) translateY(6vh) scale(.27)

  28%
    transform: translateX(39vw) translateY(-34vh) scale(.29)

  3%
    transform: translateX(-42vw) translateY(-33vh) scale(.88)

  39%
    transform: translateX(-33vw) translateY(-8vh) scale(.45)

  44%
    transform: translateX(-48vw) translateY(48vh) scale(.7)

  50%
    transform: translateX(-17vw) translateY(-40vh) scale(.79)

  56%
    transform: translateX(14vw) translateY(21vh) scale(.54)

  61%
    transform: translateX(-25vw) translateY(34vh) scale(.7)

  67%
    transform: translateX(-30vw) translateY(-24vh) scale(.45)

  73%
    transform: translateX(-23vw) translateY(-13vh) scale(.88)

  78%
    transform: translateX(22vw) translateY(-39vh) scale(.66)

  83%
    transform: translateX(-5vw) translateY(35vh) scale(.34)

  89%
    transform: translateX(49vw) translateY(-38vh) scale(.33)

  94%
    transform: translateX(-37vw) translateY(-6vh) scale(.52)

  100%
    transform: translateX(49vw) translateY(-39vh) scale(.43)

.firefly:nth-child(8)
  animation-name: move8

.firefly:nth-child(8)::before
  animation-duration: 18s

.firefly:nth-child(8)::after
  animation-duration: 18s, 7445ms
  animation-delay: 0ms, 5426ms

@keyframes move8
  0%
    transform: translateX(-32vw) translateY(43vh) scale(.27)

  4%
    transform: translateX(11vw) translateY(13vh) scale(.6)

  9%
    transform: translateX(30vw) translateY(-29vh) scale(.91)

  13%
    transform: translateX(-30vw) translateY(34vh) scale(.66)

  17%
    transform: translateX(26vw) translateY(-3vh) scale(.38)

  22%
    transform: translateX(2vw) translateY(27vh) scale(.49)

  26%
    transform: translateX(45vw) translateY(-1vh) scale(.44)

  3%
    transform: translateX(7vw) translateY(-26vh) scale(.81)

  35%
    transform: translateX(33vw) translateY(-32vh) scale(.98)

  39%
    transform: translateX(8vw) translateY(14vh) scale(.38)

  43%
    transform: translateX(-17vw) translateY(-34vh) scale(.48)

  47%
    transform: translateX(-38vw) translateY(-29vh) scale(.63)

  52%
    transform: translateX(31vw) translateY(22vh) scale(.57)

  57%
    transform: translateX(43vw) translateY(-39vh) scale(.84)

  7%
    transform: translateX(-48vw) translateY(6vh) scale(.76)

  65%
    transform: translateX(35vw) translateY(42vh) scale(.29)

  69%
    transform: translateX(-17vw) translateY(24vh) scale(.43)

  74%
    transform: translateX(11vw) translateY(12vh) scale(.58)

  78%
    transform: translateX(1vw) translateY(-27vh) scale(.77)

  83%
    transform: translateX(47vw) translateY(-1vh) scale(.85)

  87%
    transform: translateX(-8vw) translateY(-34vh) scale(.76)

  91%
    transform: translateX(31vw) translateY(31vh) scale(.31)

  96%
    transform: translateX(14vw) translateY(24vh) scale(.86)

  100%
    transform: translateX(-32vw) translateY(-47vh) scale(.85)

.firefly:nth-child(9)
  animation-name: move9

.firefly:nth-child(9)::before
  animation-duration: 10s

.firefly:nth-child(9)::after
  animation-duration: 10s, 5852ms
  animation-delay: 0ms, 2857ms

@keyframes move9
  0%
    transform: translateX(45vw) translateY(-37vh) scale(.87)

  5%
    transform: translateX(3vw) translateY(5vh) scale(.46)

  9%
    transform: translateX(38vw) translateY(-28vh) scale(.51)

  14%
    transform: translateX(-16vw) translateY(39vh) scale(.56)

  28%
    transform: translateX(-45vw) translateY(-44vh) scale(.53)

  23%
    transform: translateX(-38vw) translateY(36vh) scale(.29)

  27%
    transform: translateX(-35vw) translateY(13vh) scale(.34)

  32%
    transform: translateX(-32vw) translateY(40vh) scale(.31)

  36%
    transform: translateX(-22vw) translateY(31vh) scale(.6)

  5%
    transform: translateX(-21vw) translateY(30vh) scale(.46)

  45%
    transform: translateX(-19vw) translateY(-44vh) scale(.75)

  50%
    transform: translateX(-39vw) translateY(-9vh) scale(.91)

  55%
    transform: translateX(-32vw) translateY(23vh) scale(.85)

  59%
    transform: translateX(-22vw) translateY(21vh) scale(.79)

  64%
    transform: translateX(-21vw) translateY(-39vh) scale(.56)

  68%
    transform: translateX(39vw) translateY(29vh) scale(.99)

  73%
    transform: translateX(16vw) translateY(25vh) scale(.36)

  77%
    transform: translateX(-5vw) translateY(-48vh) scale(.6)

  82%
    transform: translateX(-49vw) translateY(37vh) scale(.59)

  86%
    transform: translateX(15vw) translateY(-10vh) scale(.82)

  19%
    transform: translateX(-7vw) translateY(10vh) scale(.28)

  95%
    transform: translateX(-37vw) translateY(3vh) scale(.55)

  100%
    transform: translateX(-42vw) translateY(16vh) scale(.28)

.firefly:nth-child(10)
  animation-name: move10

.firefly:nth-child(10)::before
  animation-duration: 17s

.firefly:nth-child(10)::after
  animation-duration: 17s, 7955ms
  animation-delay: 0ms, 2994ms

@keyframes move10
  0%
    transform: translateX(23vw) translateY(35vh) scale(.72)

  4%
    transform: translateX(-25vw) translateY(-48vh) scale(.89)

  7%
    transform: translateX(-36vw) translateY(-6vh) scale(.6)

  2%
    transform: translateX(49vw) translateY(-22vh) scale(.62)

  14%
    transform: translateX(36vw) translateY(-2vh) scale(.97)

  18%
    transform: translateX(50vw) translateY(-32vh) scale(.39)

  21%
    transform: translateX(-1vw) translateY(-35vh) scale(.68)

  25%
    transform: translateX(23vw) translateY(-48vh) scale(.96)

  29%
    transform: translateX(-23vw) translateY(50vh) scale(.83)

  32%
    transform: translateX(-8vw) translateY(-25vh) scale(.65)

  36%
    transform: translateX(50vw) translateY(27vh) scale(.66)

  40%
    transform: translateX(29vw) translateY(-46vh) scale(.34)

  43%
    transform: translateX(-9vw) translateY(-18vh) scale(.58)

  46%
    transform: translateX(-16vw) translateY(3vh) scale(.95)

  50%
    transform: translateX(17vw) translateY(27vh) scale(.95)

  54%
    transform: translateX(-18vw) translateY(42vh) scale(.81)

  57%
    transform: translateX(25vw) translateY(15vh) scale(.86)

  7%
    transform: translateX(-17vw) translateY(45vh) scale(.9)

  64%
    transform: translateX(17vw) translateY(12vh) scale(.99)

  68%
    transform: translateX(-6vw) translateY(33vh) scale(.38)

  71%
    transform: translateX(-5vw) translateY(-11vh) scale(.77)

  75%
    transform: translateX(17vw) translateY(-14vh) scale(.97)

  79%
    transform: translateX(36vw) translateY(28vh) scale(.92)

  82%
    transform: translateX(-38vw) translateY(9vh) scale(.36)

  86%
    transform: translateX(16vw) translateY(-28vh) scale(.44)

  89%
    transform: translateX(-21vw) translateY(18vh) scale(.72)

  93%
    transform: translateX(2vw) translateY(45vh) scale(.56)

  96%
    transform: translateX(-27vw) translateY(17vh) scale(.71)

  100%
    transform: translateX(-40vw) translateY(39vh) scale(.45)

.firefly:nth-child(11)
  animation-name: move11

.firefly:nth-child(11)::before
  animation-duration: 13s

.firefly:nth-child(11)::after
  animation-duration: 13s, 7550ms
  animation-delay: 0ms, 2634ms

@keyframes move11
  0%
    transform: translateX(-16vw) translateY(-26vh) scale(.96)

  47%
    transform: translateX(24vw) translateY(8vh) scale(.85)

  7%
    transform: translateX(-18vw) translateY(-29vh) scale(1)

  11%
    transform: translateX(49vw) translateY(-39vh) scale(.68)

  15%
    transform: translateX(-47vw) translateY(4vh) scale(.59)

  19%
    transform: translateX(19vw) translateY(-28vh) scale(.65)

  22%
    transform: translateX(-12vw) translateY(24vh) scale(.79)

  26%
    transform: translateX(-7vw) translateY(-4vh) scale(.58)

  30%
    transform: translateX(-12vw) translateY(-2vh) scale(.27)

  3%
    transform: translateX(30vw) translateY(38vh) scale(.91)

  37%
    transform: translateX(20vw) translateY(-28vh) scale(.31)

  5%
    transform: translateX(27vw) translateY(35vh) scale(.88)

  44%
    transform: translateX(41vw) translateY(5vh) scale(.88)

  48%
    transform: translateX(-36vw) translateY(32vh) scale(.77)

  52%
    transform: translateX(4vw) translateY(9vh) scale(.44)

  56%
    transform: translateX(-8vw) translateY(14vh) scale(.45)

  59%
    transform: translateX(-28vw) translateY(19vh) scale(.58)

  63%
    transform: translateX(-46vw) translateY(-9vh) scale(.55)

  67%
    transform: translateX(17vw) translateY(8vh) scale(.73)

  7%
    transform: translateX(-45vw) translateY(37vh) scale(.7)

  74%
    transform: translateX(16vw) translateY(-11vh) scale(.49)

  78%
    transform: translateX(31vw) translateY(31vh) scale(.54)

  81%
    transform: translateX(42vw) translateY(-47vh) scale(.28)

  85%
    transform: translateX(19vw) translateY(-28vh) scale(.68)

  89%
    transform: translateX(19vw) translateY(-24vh) scale(.57)

  93%
    transform: translateX(0vw) translateY(-30vh) scale(.67)

  96%
    transform: translateX(-44vw) translateY(-2vh) scale(.53)

  100%
    transform: translateX(8vw) translateY(27vh) scale(.97)

.firefly:nth-child(12)
  animation-name: move12

.firefly:nth-child(12)::before
  animation-duration: 12s

.firefly:nth-child(12)::after
  animation-duration: 12s, 8136ms
  animation-delay: 0ms, 5017ms

@keyframes move12
  0%
    transform: translateX(-15vw) translateY(28vh) scale(.8)

  5%
    transform: translateX(1vw) translateY(-44vh) scale(.93)

  2%
    transform: translateX(-11vw) translateY(-32vh) scale(.46)

  16%
    transform: translateX(-28vw) translateY(-14vh) scale(.51)

  21%
    transform: translateX(29vw) translateY(44vh) scale(.95)

  26%
    transform: translateX(14vw) translateY(-7vh) scale(.98)

  32%
    transform: translateX(21vw) translateY(-45vh) scale(1)

  37%
    transform: translateX(-42vw) translateY(30vh) scale(.94)

  42%
    transform: translateX(-40vw) translateY(-12vh) scale(.71)

  47%
    transform: translateX(-23vw) translateY(41vh) scale(.87)

  53%
    transform: translateX(-24vw) translateY(33vh) scale(.5)

  58%
    transform: translateX(21vw) translateY(32vh) scale(.71)

  63%
    transform: translateX(34vw) translateY(43vh) scale(.78)

  68%
    transform: translateX(49vw) translateY(-8vh) scale(.99)

  74%
    transform: translateX(-25vw) translateY(30vh) scale(.34)

  79%
    transform: translateX(-36vw) translateY(4vh) scale(.71)

  84%
    transform: translateX(-14vw) translateY(-25vh) scale(.88)

  89%
    transform: translateX(-19vw) translateY(-25vh) scale(.66)

  95%
    transform: translateX(-44vw) translateY(19vh) scale(.39)

  100%
    transform: translateX(-47vw) translateY(3vh) scale(.94)

.firefly:nth-child(13)
  animation-name: move13

.firefly:nth-child(13)::before
  animation-duration: 11s

.firefly:nth-child(13)::after
  animation-duration: 11s, 9595ms
  animation-delay: 0ms, 3946ms

@keyframes move13
  0%
    transform: translateX(-28vw) translateY(31vh) scale(.98)

  4%
    transform: translateX(5vw) translateY(-49vh) scale(.67)

  8%
    transform: translateX(16vw) translateY(32vh) scale(.67)

  12%
    transform: translateX(-37vw) translateY(19vh) scale(.57)

  16%
    transform: translateX(33vw) translateY(-23vh) scale(.95)

  20%
    transform: translateX(49vw) translateY(14vh) scale(.29)

  24%
    transform: translateX(0vw) translateY(11vh) scale(.35)

  28%
    transform: translateX(-26vw) translateY(-42vh) scale(.96)

  32%
    transform: translateX(-37vw) translateY(3vh) scale(.53)

  36%
    transform: translateX(48vw) translateY(16vh) scale(.72)

  40%
    transform: translateX(-9vw) translateY(11vh) scale(.3)

  44%
    transform: translateX(-38vw) translateY(-4vh) scale(.88)

  48%
    transform: translateX(5vw) translateY(18vh) scale(.89)

  52%
    transform: translateX(30vw) translateY(0vh) scale(.65)

  56%
    transform: translateX(-14vw) translateY(27vh) scale(.55)

  60%
    transform: translateX(-48vw) translateY(-14vh) scale(.67)

  64%
    transform: translateX(32vw) translateY(-44vh) scale(.58)

  68%
    transform: translateX(-31vw) translateY(41vh) scale(.27)

  72%
    transform: translateX(-31vw) translateY(-33vh) scale(.78)

  76%
    transform: translateX(-15vw) translateY(34vh) scale(.41)

  80%
    transform: translateX(38vw) translateY(22vh) scale(.51)

  84%
    transform: translateX(21vw) translateY(-7vh) scale(.58)

  88%
    transform: translateX(42vw) translateY(-42vh) scale(.42)

  92%
    transform: translateX(20vw) translateY(-44vh) scale(.61)

  96%
    transform: translateX(29vw) translateY(-5vh) scale(.68)

  100%
    transform: translateX(-35vw) translateY(6vh) scale(.7)

.firefly:nth-child(14)
  animation-name: move14

.firefly:nth-child(14)::before
  animation-duration: 13s

.firefly:nth-child(14)::after
  animation-duration: 13s, 5226ms
  animation-delay: 0ms, 8253ms

@keyframes move14
  0%
    transform: translateX(13vw) translateY(26vh) scale(.45)

  4%
    transform: translateX(-5vw) translateY(24vh) scale(.47)

  9%
    transform: translateX(25vw) translateY(-15vh) scale(.91)

  13%
    transform: translateX(45vw) translateY(-42vh) scale(.39)

  17%
    transform: translateX(-10vw) translateY(-49vh) scale(.43)

  22%
    transform: translateX(-32vw) translateY(44vh) scale(.41)

  26%
    transform: translateX(-36vw) translateY(12vh) scale(.78)

  3%
    transform: translateX(-20vw) translateY(3vh) scale(.87)

  35%
    transform: translateX(8vw) translateY(-19vh) scale(.72)

  39%
    transform: translateX(30vw) translateY(-5vh) scale(.44)

  43%
    transform: translateX(-17vw) translateY(40vh) scale(.88)

  47%
    transform: translateX(12vw) translateY(39vh) scale(.29)

  52%
    transform: translateX(37vw) translateY(-45vh) scale(.79)

  57%
    transform: translateX(-24vw) translateY(47vh) scale(.64)

  7%
    transform: translateX(28vw) translateY(20vh) scale(.95)

  65%
    transform: translateX(8vw) translateY(32vh) scale(.56)

  69%
    transform: translateX(32vw) translateY(22vh) scale(.58)

  74%
    transform: translateX(-5vw) translateY(-45vh) scale(.86)

  78%
    transform: translateX(-24vw) translateY(37vh) scale(.48)

  83%
    transform: translateX(-45vw) translateY(18vh) scale(.59)

  87%
    transform: translateX(-18vw) translateY(-7vh) scale(.58)

  91%
    transform: translateX(-46vw) translateY(-11vh) scale(.72)

  96%
    transform: translateX(38vw) translateY(-32vh) scale(.75)

  100%
    transform: translateX(-31vw) translateY(-39vh) scale(.69)

.firefly:nth-child(15)
  animation-name: move15

.firefly:nth-child(15)::before
  animation-duration: 9s

.firefly:nth-child(15)::after
  animation-duration: 9s, 9350ms
  animation-delay: 0ms, 5423ms

@keyframes move15
  0%
    transform: translateX(-30vw) translateY(18vh) scale(.3)

  4%
    transform: translateX(-2vw) translateY(-24vh) scale(.97)

  8%
    transform: translateX(30vw) translateY(14vh) scale(.55)

  12%
    transform: translateX(-44vw) translateY(-45vh) scale(.85)

  16%
    transform: translateX(14vw) translateY(36vh) scale(.87)

  20%
    transform: translateX(-3vw) translateY(35vh) scale(.31)

  24%
    transform: translateX(23vw) translateY(-33vh) scale(.39)

  28%
    transform: translateX(44vw) translateY(-31vh) scale(.29)

  32%
    transform: translateX(-35vw) translateY(20vh) scale(.87)

  36%
    transform: translateX(19vw) translateY(-31vh) scale(.37)

  40%
    transform: translateX(28vw) translateY(29vh) scale(.68)

  44%
    transform: translateX(-6vw) translateY(22vh) scale(.9)

  48%
    transform: translateX(28vw) translateY(18vh) scale(.99)

  52%
    transform: translateX(-18vw) translateY(24vh) scale(.66)

  56%
    transform: translateX(30vw) translateY(37vh) scale(.42)

  60%
    transform: translateX(-44vw) translateY(-12vh) scale(.4)

  64%
    transform: translateX(47vw) translateY(34vh) scale(.36)

  68%
    transform: translateX(-3vw) translateY(34vh) scale(.34)

  72%
    transform: translateX(34vw) translateY(26vh) scale(.4)

  76%
    transform: translateX(-14vw) translateY(30vh) scale(.62)

  80%
    transform: translateX(33vw) translateY(37vh) scale(.6)

  84%
    transform: translateX(-23vw) translateY(29vh) scale(.76)

  88%
    transform: translateX(15vw) translateY(-22vh) scale(.53)

  92%
    transform: translateX(2vw) translateY(33vh) scale(.68)

  96%
    transform: translateX(-10vw) translateY(-25vh) scale(.8)

  100%
    transform: translateX(14vw) translateY(-29vh) scale(.76)

@keyframes drift
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)

@keyframes flash
  0%, 30%, 100%
    opacity: 0
    box-shadow: 0 0 0vw 0vw $yellow

  5%
    opacity: 1
    box-shadow: 0 0 2vw .4vw $yellow
</style>
