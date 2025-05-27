<script setup lang="ts">
import { ref } from 'vue'
import { Lunar, Solar } from 'lunar-typescript'
import { ElMessage } from 'element-plus'

const inputDate = ref('')
const result = ref<any>(null)

const zodiacInfo: Record<
  string,
  { trait: string; color: string; number: string }
> = {
  鼠: {
    trait: '聪明伶俐、反应灵敏',
    color: '蓝色、金色、绿色',
    number: '2, 3',
  },
  牛: {
    trait: '勤奋踏实、责任心强',
    color: '白色、黄色、蓝色',
    number: '1, 4',
  },
  虎: {
    trait: '勇敢果断、富有正义感',
    color: '灰色、白色、蓝色',
    number: '1, 3, 4',
  },
  兔: {
    trait: '温和善良、机敏有礼',
    color: '红色、粉色、紫色、蓝色',
    number: '3, 4, 6',
  },
  龙: {
    trait: '果敢自信、富有魅力',
    color: '金色、银色、灰色',
    number: '1, 6, 7',
  },
  蛇: {
    trait: '思维敏捷、富有洞察力',
    color: '黑色、红色、黄色',
    number: '2, 8, 9',
  },
  马: {
    trait: '热情奔放、充满活力',
    color: '黄色、绿色、红色',
    number: '2, 3, 7',
  },
  羊: {
    trait: '温柔体贴、富有同情心',
    color: '绿色、红色、紫色',
    number: '2, 7',
  },
  猴: {
    trait: '机智灵活、幽默风趣',
    color: '白色、蓝色、金色',
    number: '1, 7, 8',
  },
  鸡: {
    trait: '精明能干、严谨认真',
    color: '金色、棕色、黄色',
    number: '5, 7, 8',
  },
  狗: {
    trait: '忠诚正直、责任感强',
    color: '红色、绿色、紫色',
    number: '3, 4, 9',
  },
  猪: {
    trait: '善良诚实、乐观大方',
    color: '黄色、灰色、棕色',
    number: '2, 5, 8',
  },
}

const calculateBirthday = () => {
  if (!inputDate.value) {
    ElMessage.warning('请选择出生日期')
    return
  }
  try {
    const [year, month, day] = inputDate.value.split('-').map(Number)
    const birthDate = new Date(year, month - 1, day)
    const lunar = Lunar.fromDate(birthDate)

    const currentYear = new Date().getFullYear()
    const thisYearLunar = Lunar.fromYmd(
      currentYear,
      lunar.getMonth(),
      lunar.getDay(),
    )
    const thisYearSolar = thisYearLunar.getSolar()
    const today = Solar.fromDate(new Date()).getLunar()

    const zodiac = lunar.getShengxiao()

    result.value = {
      solarDate: `${year}年${month}月${day}日`,
      lunarDate: lunar.toString(),
      zodiac,
      constellation: getConstellation(month, day),
      thisYearSolar: `${thisYearSolar.getYear()}年${thisYearSolar.getMonth()}月${thisYearSolar.getDay()}日`,
      ganzhi: lunar.getYearInGanZhi(),
      lunarMonth: lunar.getMonthInChinese(),
      lunarDay: lunar.getDayInChinese(),
      jieqi: lunar.getJieQi(),
      zodiacInfo: zodiacInfo[zodiac],

      // 黄历
      yi: today.getDayYi().join('、'),
      ji: today.getDayJi().join('、'),
      chongSha: today.getChongDesc() + ' ' + today.getSha(),
      zhiShen: today.getZheng(),
      jiShen: today.getDayJiShen().join('、'),

      yearGanZhi: lunar.getYearInGanZhi(),
      yearGanZhiByLiChun: lunar.getYearInGanZhiByLiChun(),
      yearGanZhiExact: lunar.getYearInGanZhiExact(),
      monthGanZhi: lunar.getMonthInGanZhi(),
      monthGanZhiExact: lunar.getMonthInGanZhiExact(),
      dayGanZhi: lunar.getDayInGanZhi(),
      dayGanZhiExact: lunar.getDayInGanZhiExact(),
      timeGanZhi: lunar.getTimeInGanZhi(),

      yearShengxiao: lunar.getYearShengXiao(),
      monthShengxiao: lunar.getMonthShengXiao(),
      dayShengxiao: lunar.getDayShengXiao(),
      timeShengxiao: lunar.getTimeShengXiao(),

      pengZuGan: lunar.getPengZuGan(),
      pengZuZhi: lunar.getPengZuZhi(),

      positionXi: lunar.getTimePositionXiDesc(),
      positionCai: lunar.getTimePositionCaiDesc(),
      positionFu: lunar.getTimePositionFuDesc(),
      positionYangGui: lunar.getTimePositionYangGuiDesc(),
      positionYinGui: lunar.getTimePositionYinGuiDesc(),
    }
  } catch (e) {
    ElMessage.error('日期转换失败：' + (e as Error).message)
  }
}

const getConstellation = (month: number, day: number): string => {
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
  const constellations = [
    '摩羯座',
    '水瓶座',
    '双鱼座',
    '白羊座',
    '金牛座',
    '双子座',
    '巨蟹座',
    '狮子座',
    '处女座',
    '天秤座',
    '天蝎座',
    '射手座',
  ]
  return constellations[month - (day < dates[month - 1] ? 1 : 0)]
}
</script>

<template>
  <div
    class="max-w-3xl mx-auto mt-8 p-6 rounded-xl shadow-lg border border-gray-200 bg-white"
  >
    <h2 class="text-xl font-bold mb-4">生日查询工具</h2>
    <el-date-picker
      v-model="inputDate"
      type="date"
      placeholder="选择出生日期"
      value-format="YYYY-MM-DD"
      @change="calculateBirthday"
      class="mb-4"
    />

    <div v-if="result" class="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg">
      <p>🌞 公历生日: {{ result.solarDate }}</p>
      <p>🌙 农历生日: {{ result.lunarDate }}</p>
      <p>📅 今年阳历生日: {{ result.thisYearSolar }}</p>
      <p>🧧 生肖: {{ result.zodiac }} — {{ result.zodiacInfo.trait }}</p>
      <p>🎨 幸运颜色: {{ result.zodiacInfo.color }}</p>
      <p>🔢 幸运数字: {{ result.zodiacInfo.number }}</p>
      <p>🔮 星座: {{ result.constellation }}</p>
      <p>📜 干支: {{ result.ganzhi }}</p>
      <p v-if="result.jieqi">🌿 节气: {{ result.jieqi }}</p>
      <p>🗓️ 农历: {{ result.lunarMonth }}{{ result.lunarDay }}</p>

      <p class="mt-4 font-semibold">📖 今日黄历信息：</p>
      <p>✅ 宜: {{ result.yi }}</p>
      <p>❌ 忌: {{ result.ji }}</p>
      <p>⚠️ 冲煞: {{ result.chongSha }}</p>
      <p>🧿 值神: {{ result.zhiShen }}</p>
      <p>🎯 吉神: {{ result.jiShen }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind 已覆盖大部分样式 */
</style>
