<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 class="text-2xl font-bold text-center mb-6">数据的加密与解密</h2>
      <div class="mb-4">
        <label for="key" class="block text-gray-700 font-medium mb-2"
          >密钥:</label
        >
        <input
          v-model="key"
          type="password"
          id="key"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div class="mb-4">
        <label for="plain" class="block text-gray-700 font-medium mb-2"
          >明文:</label
        >
        <textarea
          v-model="plain"
          id="plain"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          @click="encryptText"
          class="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          加密
        </button>
        <label for="encrypted" class="block text-gray-700 font-medium mt-4 mb-2"
          >加密后:</label
        >
        <textarea
          v-model="encrypted"
          id="encrypted"
          class="w-full p-2 border rounded-lg bg-gray-100"
          readonly
        ></textarea>
      </div>
      <div class="mb-4">
        <label for="todecrypt" class="block text-gray-700 font-medium mb-2"
          >密文:</label
        >
        <textarea
          v-model="toDecrypt"
          id="todecrypt"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          @click="decryptText"
          class="mt-2 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          解密
        </button>
        <label for="decrypted" class="block text-gray-700 font-medium mt-4 mb-2"
          >解密结果:</label
        >
        <textarea
          v-model="decrypted"
          id="decrypted"
          class="w-full p-2 border rounded-lg bg-gray-100"
          readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

const key = ref<string>('')
const plain = ref<string>('')
const encrypted = ref<string>('')
const toDecrypt = ref<string>('')
const decrypted = ref<string>('')

function encryptText() {
  if (!key.value || !plain.value) {
    alert('请填写密钥和明文')
    return
  }
  encrypted.value = encrypt(plain.value, key.value)
}

function decryptText() {
  if (!key.value || !toDecrypt.value) {
    alert('请填写密钥和密文')
    return
  }
  try {
    decrypted.value = decrypt(toDecrypt.value, key.value)
  } catch (e) {
    decrypted.value = '解密失败，请检查密钥或者密文'
  }
}

function encrypt(content: string, key: string): string {
  return CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
}

function decrypt(content: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
    if (decryptedText) {
      return decryptedText
    } else {
      throw new Error('解密失败')
    }
  } catch (e) {
    throw new Error('解密失败')
  }
}
</script>

<style scoped>
/* TailwindCSS is used for styling. No additional CSS is necessary here. */
</style>
