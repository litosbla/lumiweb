function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class Experience {
  constructor(
  options = {
    containerSelector: "[data-app-container]" })

  {_defineProperty(this, "init",
    () => {
      this.createApp();
      this.createItems();
      this.initScroll();
      this.update();

      this.container.classList.add("is-ready");
    });_defineProperty(this, "initScroll",

    () => {
      this.scrollSmoother = ScrollSmoother.create({
        content: "#content",
        smooth: 1.2 });


      // Add scroll triggers for each span item
      document.querySelectorAll("span").forEach(span => {
        ScrollTrigger.create({
          trigger: span,
          start: "top 90%",
          end: "bottom 10%",
          onUpdate: self => {
            const dist = Math.abs(self.progress - 0.5);
            const lightness = this.mapToRange(dist, 0, 0.5, 80, 100);
            span.style.setProperty("--l", lightness + "%");
          } });

      });
    });_defineProperty(this, "createApp",

    () => {
      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true });

      this.renderer.setPixelRatio(1.5);
      this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight);

      this.container.appendChild(this.renderer.domElement);

      // Camera
      this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.offsetWidth / this.container.offsetHeight,
      1,
      10000);

      this.camera.position.set(0, 0, this.settings.cameraDistance);
      this.scene = new THREE.Scene();

      // Orbit Controls
      this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement);

      this.controls.enableKeys = false;
      this.controls.enableZoom = false;
      this.controls.enableDamping = false;

      // Resize the renderer on window resize
      window.addEventListener(
      "resize",
      () => {
        this.camera.aspect =
        this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
        this.container.offsetWidth,
        this.container.offsetHeight);

      },
      true);


      // Ambient Light
      let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      this.scene.add(ambientLight);

      // Directional Light
      let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight.position.set(5, 3, 2);
      directionalLight.target.position.set(0, 0, 0);
      this.scene.add(directionalLight);
    });_defineProperty(this, "createItems",

    () => {
      // Box
      let boxGeom = new THREE.BoxBufferGeometry(2, 2, 2);
      let material = new THREE.MeshLambertMaterial({
        color: 0xffffff });


      const itemCount = 40;
      for (let i = 0; i < itemCount; i++) {
        const mesh = new THREE.Mesh(boxGeom, material);
        mesh.position.y = 13 * (Math.random() * 2 - 1);
        mesh.position.x = 3 * (Math.random() * 2 - 1);
        mesh.position.z = 4 * (Math.random() * 2 - 1);
        mesh.rotation.y = Math.PI * Math.random();
        mesh.rotationSpeed = Math.random() * 0.01 + 0.005;
        this.scene.add(mesh);
        this.meshes.push(mesh);
      }
    });_defineProperty(this, "updateItems",

    () => {
      const time = this.time;
      const amplitude = 0.05;
      const period = this.settings.scalePeriod;

      const baseScale = 0.2;
      const scaleEffect =
      baseScale + amplitude * Math.sin(Math.PI * 2 * (time / period));

      this.meshes.forEach(mesh => {
        mesh.scale.set(scaleEffect, scaleEffect, scaleEffect);

        // Update rotation
        mesh.rotation.x += mesh.rotationSpeed;
      });

      // Update camera
      const cameraRange = 10;
      this.camera.position.y = this.mapToRange(
      this.scrollSmoother.progress,
      0,
      1,
      cameraRange,
      -cameraRange);

    });_defineProperty(this, "mapToRange",

    (value, inMin, inMax, outMin, outMax) => {
      return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    });_defineProperty(this, "update",

    () => {
      this.time = this.clock.getElapsedTime();

      this.updateItems();

      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(this.update);
    });this.options = options;this.container = document.querySelector(this.options.containerSelector); // GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother); // Time
    this.clock = new THREE.Clock();this.time = 0; // THREE items
    this.renderer;this.camera;this.scene;this.controls;this.meshes = []; // Rotation
    this.targetRotation = 0; // Settings
    this.settings = { cameraDistance: 5, scalePeriod: 8 };this.init();}}new Experience();