// Registramos los plugins necesarios
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Creamos la instancia de ScrollSmoother
let smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",  // Contenedor principal
  content: "#smooth-content",  // Contenido principal
  smooth: 2,                   // Intensidad del suavizado (ajustable según preferencia)
  effects: true,
  onUpdate: self => {
    // Efecto de skew para las imágenes de la cuadrícula
    gsap.utils.toArray(".grid-image").forEach(img => {
      let clamp = gsap.utils.clamp(-5, 5);
      gsap.to(img, {
        skewY: clamp(self.getVelocity() / -50),
        duration: 0.1
      });
    });
    
    // Efecto de movimiento vertical para textos
    gsap.utils.toArray(".texto-animado").forEach(texto => {
      // El valor negativo hace que se mueva hacia arriba cuando haces scroll hacia abajo
      let movimientoY = self.getVelocity() / 10;
      
      // Limitamos el movimiento para que no sea demasiado extremo
      let movimientoLimitado = gsap.utils.clamp(-30, 30, movimientoY);
      
      gsap.to(texto, {
        y: movimientoLimitado,
        duration: 0.3
      });
    });
  },
  onStop: () => {
    // Restablecemos todos los efectos cuando el scrolling se detiene
    gsap.to(".grid-image", {
      skewY: 0,
      duration: 0.5
    });
    
    // Restablecemos la posición vertical de los textos
    gsap.to(".texto-animado", {
      y: 0,
      duration: 0.5
    });
  }
});

// Animación del SVG (dibujo)
gsap.from('.draw', {
  drawSVG: "0%",
  ease: "expo.out",
  scrollTrigger: {
    trigger: '.heading',
    start: "clamp(top center)",
    scrub: true,
    pin: '.pin',
    pinSpacing: false,
    markers: false,
  }
});

// Efecto de aparición de logo
gsap.set(".logo svg", {opacity: 1});

// Detectar cuando los elementos entran en el viewport
ScrollTrigger.batch(".texto-animado", {
  onEnter: (elements) => {
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    });
    elements.forEach(el => el.classList.add("is-inview"));
  },
  onLeave: (elements) => {
    gsap.to(elements, {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      duration: 0.5
    });
    elements.forEach(el => el.classList.remove("is-inview"));
  },
  onEnterBack: (elements) => {
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: -0.1,
      duration: 0.5
    });
    elements.forEach(el => el.classList.add("is-inview"));
  },
  onLeaveBack: (elements) => {
    gsap.to(elements, {
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.5
    });
    elements.forEach(el => el.classList.remove("is-inview"));
  },
  start: "top 85%",    // Cuándo comienza la animación (el elemento está en el 85% inferior de la pantalla)
  end: "bottom 15%"    // Cuándo termina la animación (el elemento sale por la parte superior del 15% de la pantalla)
});



// tercera parte
document.addEventListener('DOMContentLoaded', () => {
  const slidesSection = document.querySelector('.slides-section');
  const slides = gsap.utils.toArray('.slide');
  const overlay = document.querySelector('.overlay');
  const images = gsap.utils.toArray('.overlay__img-cont .image');
  const count = document.querySelector('.count');

  if (!slidesSection || slides.length === 0) return;

  // Creamos un contenedor para todos los slides
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'slides-container';
  
  // Movemos todos los slides al nuevo contenedor
  slides.forEach(slide => {
    slidesSection.removeChild(slide);
    slidesContainer.appendChild(slide);
  });
  
  slidesSection.appendChild(slidesContainer);

  // Configuramos el contenedor para ser una fila horizontal
  gsap.set(slidesContainer, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: slides.length * 100 + '%', // Ancho total igual a todos los slides
    height: '100%',
    display: 'flex'
  });

  // Configuramos los slides para que estén uno al lado del otro
  gsap.set(slides, {
    position: 'relative', // Cambiamos de absolute a relative
    top: 0,
    left: 0,
    width: 100 / slides.length + '%', // Cada slide ocupa su porción del ancho total
    height: '100%'
  });

  // Configuración del overlay
  if (overlay) {
    gsap.set(overlay, {
      position: 'fixed',
      top: '50%',
      right: '5%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      opacity: 1 // Hacemos visible el overlay
    });

    if (images.length > 0) {
      gsap.set(images, { autoAlpha: 0 });
      gsap.set(images[0], { autoAlpha: 1 });
    }
  }

  // ScrollTrigger para el slider horizontal
  ScrollTrigger.create({
    trigger: slidesSection,
    pin: true,
    anticipatePin: 1,
    pinSpacing: true,
    start: "top top",
    end: () => "+=" + (slides.length * 100) + "%",
    scrub: 1,
    onUpdate: (self) => {
      let slideIndex = Math.floor(self.progress * slides.length);
      if (slideIndex >= slides.length) slideIndex = slides.length - 1;
      
      if (count) {
        count.textContent = (slideIndex + 1).toString().padStart(2, '0');
      }
      
      if (images.length > 0) {
        gsap.to(images, { autoAlpha: 0, duration: 0.5 });
        gsap.to(images[slideIndex], { autoAlpha: 1, duration: 0.5 });
      }
    },
    
  });

  // Animación para mover el contenedor de slides horizontalmente
  gsap.to(slidesContainer, {
    x: () => -(slidesContainer.offsetWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: slidesSection,
      start: "top top",
      end: () => "+=" + (slides.length * 100) + "%",
      scrub: 1
    }
  });

  // Animaciones para los elementos internos de cada slide
  slides.forEach((slide, i) => {
    const heading = slide.querySelector('.slide__heading');
    const image = slide.querySelector('.slide__img');
    
    if (heading && image) {
      gsap.timeline({
        scrollTrigger: {
          trigger: slidesSection,
          start: () => "top top+=" + (i * (100 / slides.length)) + "%",
          end: () => "top top+=" + ((i + 1) * (100 / slides.length)) + "%",
          scrub: true
        }
      })
      .from(heading, { autoAlpha: 0, x: -50, duration: 0.5 })
      .from(image, { autoAlpha: 0, scale: 0.8, duration: 0.5 }, "-=0.3");
    }
  });
});

// cuarta parte


const n = 19
const rots = [
  { ry: 270, a:0.5 },
  { ry: 0,   a:0.85 },
  { ry: 90,  a:0.4 },
  { ry: 180, a:0.0 }
]

gsap.set(".face", {
  z: 200,
  rotateY: i => rots[i].ry,
  transformOrigin: "50% 50% -201px"
});

for (let i=0; i<n; i++){
  let die = document.querySelector('.die')
  let cube = die.querySelector('.cube')
  
  if (i>0){    
    let clone = document.querySelector('.die').cloneNode(true);
    document.querySelector('.tray').append(clone);
    cube = clone.querySelector('.cube')
  }
  
  gsap.timeline({repeat:-1, yoyo:true, defaults:{ease:'power3.inOut', duration:1}})
  .fromTo(cube, {
    rotateY:-90
  },{
    rotateY:90,
    ease:'power1.inOut',
    duration:2
  })
  .fromTo(cube.querySelectorAll('.face'), {
    color:(j)=>'hsl('+(i/n*75+130)+', 67%,'+(100*[rots[3].a, rots[0].a, rots[1].a][j])+'%)'
  },{
    color:(j)=>'hsl('+(i/n*75+130)+', 67%,'+(100*[rots[0].a, rots[1].a, rots[2].a][j])+'%)'
  }, 0)
  .to(cube.querySelectorAll('.face'), {
    color:(j)=>'hsl('+(i/n*75+130)+', 67%,'+(100*[rots[1].a, rots[2].a, rots[3].a][j])+'%)'
  }, 1)
  .progress(i/n)
}

gsap.timeline()
  .from('.tray', {yPercent:-3, duration:2, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)
  .fromTo('.tray', {rotate:-15},{rotate:15, duration:4, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)
  .from('.die', {duration:0.01, opacity:0, stagger:{each:-0.05, ease:'power1.in'}}, 0)
  .to('.tray', {scale:1.2, duration:2, ease:'power3.inOut', yoyo:true, repeat:-1}, 0)

window.onload = window.onresize = ()=> {
  const h = n*56
  gsap.set('.tray', {height:h})
  gsap.set('.pov', {scale:innerHeight/h})
}

gsap.set(".objeto", {
  y: 0,
  x: 0
});

// Animación para el objeto que va a la izquierda
gsap.to(".izquierda", {
  rotation:-40,
  x: -450,
  y: -400,
  duration: 1,
  scrollTrigger: {
    trigger: '.contenedor-probando',
    start: "top center",
    end: "bottom center",
    scrub: true,
    markers: false
  }
});

// Animación para el objeto que va al centro
gsap.to(".centro", {
  y: -500,
  duration: 1,
  scrollTrigger: {
    trigger: '.contenedor-probando',
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});

// Animación para el objeto que va a la derecha
gsap.to(".derecha", {
  rotation:40,
  x: 450,
  y: -400,
  duration: 1,
  scrollTrigger: {
    trigger: '.contenedor-probando',
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});
// gsap.from('.draw', {
//   drawSVG: "0%",
//   ease: "expo.out",
//   scrollTrigger: {
//     trigger: '.heading',
//     start: "clamp(top center)",
//     scrub: true,
//     pin: '.pin',
//     pinSpacing: false,
//     markers: true,
//   }
// });
// Refrescamos ScrollTrigger después de que todo se haya cargado
// para asegurar que todos los cálculos de tamaños sean correctos
window.addEventListener('load', () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});