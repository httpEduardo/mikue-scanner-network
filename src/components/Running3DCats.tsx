import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Running3DCats() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

      const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 1)
      const bodyMaterial = new THREE.MeshPhongMaterial({ color })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.6
      catGroup.add(body)

      const headGeometry = new THREE.BoxGeometry(1, 1, 0.9)
      const head = new THREE.Mesh(headGeometry, bodyMaterial)
      head.position.set(1.2, 1.3, 0)
      catGroup.add(head)

      const earGeometry = new THREE.ConeGeometry(0.25, 0.6, 3)
      const earMaterial = new THREE.MeshPhongMaterial({ color })
      const leftEar = new THREE.Mesh(earGeometry, earMaterial)
      leftEar.position.set(0.9, 2, 0.3)
      leftEar.rotation.z = -0.2
      catGroup.add(leftEar)

      const rightEar = new THREE.Mesh(earGeometry, earMaterial)
      rightEar.position.set(0.9, 2, -0.3)
      rightEar.rotation.z = 0.2
      catGroup.add(rightEar)

      const noseGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xff69b4 })
      const nose = new THREE.Mesh(noseGeometry, noseMaterial)
      nose.position.set(1.7, 1.2, 0)
      catGroup.add(nose)

      const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, emissive: 0xaaaa00 })
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(1.5, 1.5, 0.35)
      catGroup.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(1.5, 1.5, -0.35)
      catGroup.add(rightEye)

      const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8)
      const legMaterial = new THREE.MeshPhongMaterial({ color })

      const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial)
      frontLeftLeg.position.set(0.8, 0.4, 0.4)
      catGroup.add(frontLeftLeg)

      const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial)
      frontRightLeg.position.set(0.8, 0.4, -0.4)
      catGroup.add(frontRightLeg)

      const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial)
      backLeftLeg.position.set(-0.8, 0.4, 0.4)
      catGroup.add(backLeftLeg)

      const backRightLeg = new THREE.Mesh(legGeometry, legMaterial)
      backRightLeg.position.set(-0.8, 0.4, -0.4)
      catGroup.add(backRightLeg)

      const tailGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8)
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial)
      tail.position.set(-1.2, 1.2, 0)
      tail.rotation.z = Math.PI / 4
      catGroup.add(tail)

      return { 
        group: catGroup, 
        legs: [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg],
        tail,
        body
      }
    }

    const cats = [
      { ...createCat(0x65b5c8), x: -8, speed: 0.08, phase: 0 },
      { ...createCat(0xa890d3), x: -4, speed: 0.09, phase: Math.PI / 2 },
      { ...createCat(0xd16ba5), x: 0, speed: 0.07, phase: Math.PI },
      { ...createCat(0xe85d75), x: 4, speed: 0.085, phase: Math.PI * 1.5 }
    ]

    cats.forEach(cat => {
      cat.group.position.x = cat.x
      scene.add(cat.group)
    })

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x65b5c8, 1, 20)
    pointLight.position.set(0, 3, 5)
    scene.add(pointLight)

    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      cats.forEach(cat => {
        cat.group.position.x += cat.speed
        if (cat.group.position.x > 12) {
          cat.group.position.x = -12
        }

        const runCycle = time * 8 + cat.phase
        
        cat.legs[0].position.y = 0.4 + Math.sin(runCycle) * 0.2
        cat.legs[1].position.y = 0.4 + Math.sin(runCycle + Math.PI) * 0.2
        cat.legs[2].position.y = 0.4 + Math.sin(runCycle + Math.PI / 2) * 0.2
        cat.legs[3].position.y = 0.4 + Math.sin(runCycle + Math.PI * 1.5) * 0.2

        cat.body.position.y = 0.6 + Math.sin(runCycle * 2) * 0.05

        cat.tail.rotation.z = Math.PI / 4 + Math.sin(time * 5 + cat.phase) * 0.3
        cat.tail.rotation.y = Math.sin(time * 3 + cat.phase) * 0.2

        cat.group.rotation.y = Math.sin(time * 2 + cat.phase) * 0.05
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      cats.forEach(cat => {
        scene.remove(cat.group)
      })
    }
  }, [])

  return (
    <div className="fixed bottom-6 left-6 z-30 rounded-2xl bg-card/70 backdrop-blur-md border-2 border-primary/40 shadow-2xl overflow-hidden"
         style={{ boxShadow: '0 0 50px oklch(0.65 0.15 195 / 0.3), 0 0 100px oklch(0.70 0.20 340 / 0.2)' }}>
      <canvas ref={canvasRef} className="block" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm border border-primary/50"
           style={{ textShadow: '0 0 8px oklch(0.15 0.02 250), 0 0 12px oklch(0.65 0.15 195 / 0.6)' }}>
        Running Cyber Cats 🐱
      </div>
    </div>
  )
}
