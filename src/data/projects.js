export const projects = [
  {
    id: 'synthwave-analytics',
    title: 'Synthwave Analytics Dashboard',
    description:
      'Ein responsives Analytics-Interface mit Echtzeit-Visualisierungen und einem Sound-Trigger-System, das Studio-Workflows mit Produktionsdaten synchronisiert.',
    tech: ['React', 'TypeScript', 'Node.js', 'WebGL'],
    image: new URL('../assets/project-synthwave.svg', import.meta.url).href,
    url: 'https://github.com/willube'
  },
  {
    id: 'guardian-soc',
    title: 'Guardian SOC Toolkit',
    description:
      'Ein internes Security Dashboard für Blue Teams mit Erkennung von Anomalien, Playbook-Automatisierungen und integrierten Discord-Alarmevents.',
    tech: ['Next.js', 'tRPC', 'Rust', 'PostgreSQL'],
    image: new URL('../assets/project-guardian.svg', import.meta.url).href,
    url: 'https://github.com/willube'
  },
  {
    id: 'roblox-sandbox',
    title: 'Roblox Sandbox Worlds',
    description:
      'Procedural generierte Roblox-Erlebnisse mit modularem Lua-Scripting, Echtzeit-Lighting und dynamischem Economy-System für Community-Games.',
    tech: ['Lua', 'Roblox API', 'C# Tools', 'Blender'],
    image: new URL('../assets/project-roblox.svg', import.meta.url).href,
    url: 'https://www.roblox.com'
  },
  {
    id: 'soundscape-lab',
    title: 'Soundscape Lab',
    description:
      'Ein hybrider Musikproduktions-Stack mit FL Studio Templates, Node.js MIDI-Bridges und Echtzeit-Sync zu Ableton Link für kollaborative Sessions.',
    tech: ['FL Studio', 'Node.js', 'Ableton Link', 'Three.js'],
    image: new URL('../assets/project-soundscape.svg', import.meta.url).href,
    url: 'https://soundcloud.com'
  },
  {
    id: 'aurinet-secure',
    title: 'Aurinet Secure Mesh',
    description:
      'Federleichtes Mesh-Netzwerk mit Zero-Trust-Prinzipien, mutual TLS, automatisierten Pen-Testing-Workflows und gehärteten Build-Pipelines.',
    tech: ['Go', 'WireGuard', 'Kubernetes', 'Grafana'],
    image: new URL('../assets/project-guardian.svg', import.meta.url).href,
    url: 'https://github.com/willube'
  },
  {
    id: 'neon-lofi-pack',
    title: 'Neon Lofi Sample Pack',
    description:
      '50 handcrafted Lofi-Loops, Pads und Drum-Samples inspiriert von Cyberpunk-Ästhetik. Inklusive lizensierbarer Stems und Serum-Presets.',
    tech: ['FL Studio', 'Serum', 'Ozone', 'Scripting'],
    image: new URL('../assets/project-soundscape.svg', import.meta.url).href,
    url: 'https://soundcloud.com'
  }
];
