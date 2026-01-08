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
      const bodyMaterial = new THREE.MeshPhongMaterial({ color })
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })

      const headGeometry = new THREE.SphereGeometry(1, 16, 16)
      const head = new THREE.Mesh(headGeometry, bodyMaterial)
      head.position.y = 1.5
      head.scale.set(1, 0.9, 0.9)
      catGroup.add(head)

      const earGeometry = new THREE.ConeGeometry(0.25, 0.6, 3)
      const leftEar = new THREE.Mesh(earGeometry, bodyMaterial)
      leftEar.rotation.z = Math.PI / 8
      leftEar.position.set(-0.6, 2, -0.3)
      catGroup.add(leftEar)

      const rightEar = new THREE.Mesh(earGeometry, bodyMaterial)
      rightEar.rotation.z = -Math.PI / 8
      rightEar.position.set(0.6, 2, -0.3)
      catGroup.add(rightEar)

      const noseGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const nose = new THREE.Mesh(noseGeometry, new THREE.MeshPhongMaterial({ color: 0xff69b4 }))
      nose.position.set(0, 1.3, 0.8)
      catGroup.add(nose)

      const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(-0.35, 1.65, 0.7)
      catGroup.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(0.35, 1.65, 0.7)
      catGroup.add(rightEye)

      const bodyGeometry = new THREE.BoxGeometry(1.8, 1, 1.2)
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.6
      catGroup.add(body)

      const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8)
      const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      frontLeftLeg.position.set(0.6, 0.4, 0.4)
      catGroup.add(frontLeftLeg)

      const frontRightLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      frontRightLeg.position.set(-0.6, 0.4, 0.4)
      catGroup.add(frontRightLeg)

      const backLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      backLeftLeg.position.set(0.6, 0.4, -0.4)
      catGroup.add(backLeftLeg)

      const backRightLeg = new THREE.Mesh(legGeometry, bodyMaterial)
      backRightLeg.position.set(-0.6, 0.4, -0.4)
      catGroup.add(backRightLeg)

      const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.5, 8)
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial)
      tail.rotation.z = Math.PI / 4
      tail.position.set(0, 1, -1)
      catGroup.add(tail)

      return {
        group: catGroup,
        body,
        head,
        tail,
        legs: [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg],
        speed: 0.02 + Math.random() * 0.02
      }
    }

    const cats = [
      { ...createCat(0x65b5c8), lane: 1 },
      { ...createCat(0x70c0e0), lane: 0 },
      { ...createCat(0x5aa8c0), lane: -1 }
    ]

    cats.forEach(cat => {
      scene.add(cat.group)
      cat.group.position.x = -15
      cat.group.position.z = cat.lane * 2.5
    })

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x65b5c8, 1, 20)
    pointLight.position.set(0, 5, 0)
    scene.add(pointLight)

    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      cats.forEach(cat => {
        cat.group.position.x += cat.speed

        if (cat.group.position.x > 15) {
          cat.group.position.x = -15
        }

        const runCycle = Date.now() * 0.003
        cat.legs[0].position.y = 0.4 + Math.sin(runCycle + cat.lane) * 0.2
        cat.legs[1].position.y = 0.4 + Math.sin(runCycle + Math.PI + cat.lane) * 0.2
        cat.legs[2].position.y = 0.4 + Math.sin(runCycle + Math.PI + cat.lane) * 0.2
        cat.legs[3].position.y = 0.4 + Math.sin(runCycle + cat.lane) * 0.2

        cat.body.position.y = 0.6 + Math.sin(runCycle * 2) * 0.05
        cat.tail.rotation.z = Math.PI / 4 + Math.sin(runCycle * 3) * 0.3
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      cats.forEach(cat => scene.remove(cat.group))
      renderer.dispose()
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 pointer-events-none z-0 opacity-40">
      <canvas 
        ref={canvasRef} 
        className="rounded-lg"
        style={{ boxShadow: '0 0 50px oklch(0.65 0.15 195 / 0.3), 0 0 100px oklch(0.70 0.20 340 / 0.2)' }}
      />
      <div className="text-center mt-2">
        <p className="text-xs text-primary/60 font-mono">Running 3D Cats</p>
      </div>
    </div>
  )
}
