module.exports = {
  mode: 'jit',
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: { extend: {} },
  plugins: [],

  safelist: [
    // ถ้าคุณสร้างชื่อคลาสแบบไดนามิก ควรใส่ที่ต้องการ whitelist ไว้
    // 'bg-red-500','md:grid','lg:flex'
  ]
}