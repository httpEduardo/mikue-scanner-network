import { useEffect, useRef } from 'react'


  useEffect(() => {


  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    })
    
    renderer.setSize(400, 300)
    renderer.setClearColor(0x000000, 0)
    camera.position.z = 12
    camera.position.y = 2

    const createCat = (color: number) => {
      const catGroup = new THREE.Group()

      const head = new THREE.Mesh(headGeometry, bodyMateria
      catGroup.add(head)
      const earGeometry = new THREE.ConeGeometry(0.25, 0.6, 3
      const leftEar = new T
      leftEar.rotation.z

      rightEar.position.set(0.9, 2, -0.3)
      catGroup.add(rightEar)
      const noseGeometry = new THREE
      const nose = new T

      const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      catGroup.add(leftEye)
      const rightEye = new THREE.Mesh(e
      catGroup.add(rightEye)
      const legGeometry = n

      frontLeftLeg.position.set(0.8, 0.4, 0.4)

      frontRightLeg.position.se



      backRightLeg.position.set(-0.8, 0.4, -0.4)

      const tail = new THREE.Mesh(ta
      tail.rotation.z = 

        group: catGroup, 
        tail,
      }

      { ...createCat(0x65b5

    ]
    cats.forEach(cat => {
      scene.add(cat.group)

    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff

    const pointLight = new THREE.PointLight(0x65b5c8, 1, 20)
    scene.add(pointLight)
    let animationFrameId: number



        cat.group.position.x += c


        
        cat.legs[1].position.y 

        cat.body.position.y = 0.6 + Math.sin(runCycle * 2) * 0.05
        cat.tail.rotation.z = Math.PI / 4 + Math


      renderer.render(scene, camera)


      cancelAnimationFrame(animatio
      cats.forEach(cat =

  }, [])
  return (
         style={{ boxShadow: '0 0 50px oklch(0.65 0.15 195 / 0.3), 0 0 
      <div cl
        Runn
    </d
}













































































