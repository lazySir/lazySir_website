<script setup lang="ts">
import { ref } from 'vue'
import Marquee from '@/components/public/inspiraUI/Marquee.vue'
// Reviews data
const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: '@/assets/images/public/marquee/1.png',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'John',
    username: '@john',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Jane',
    username: '@jane',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: 'James',
    username: '@james',
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: 'https://avatar.vercel.sh/james',
  },
]

// Split reviews into two rows
const firstRow = ref(reviews.slice(0, reviews.length / 2))
const secondRow = ref(reviews.slice(reviews.length / 2))
</script>

<template>
  <div
    class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background"
  >
    <!-- First Marquee -->
    <Marquee pause-on-hover class="[--duration:20s]">
      <ReviewCard
        v-for="review in firstRow"
        :key="review.username"
        :img="review.img"
        :text="review.name"
        :link="review.username"
      />
    </Marquee>

    <!-- Left Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
    ></div>

    <!-- Right Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
    ></div>
  </div>
</template>
