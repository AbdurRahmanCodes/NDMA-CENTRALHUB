import React from 'react';
import { Code, Brain, Database, Cpu, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const team = [
    {
      name: 'Muhammad Zain Nasir',
      role: 'Full Stack Web Developer',
      icon: <Code className="w-6 h-6" />,
      color: 'blue',
    },
    {
      name: 'Muhammad Ahsan Aftab',
      role: 'AI Engineer',
      icon: <Brain className="w-6 h-6" />,
      color: 'purple',
    },
    {
      name: 'Abdul Moeez',
      role: 'Full Stack Web Developer',
      icon: <Code className="w-6 h-6" />,
      color: 'green',
    },
    {
      name: 'Abdur Rehman',
      role: 'Data Scientist',
      icon: <Database className="w-6 h-6" />,
      color: 'orange',
    },
    {
      name: 'Qazi Tehmas',
      role: 'Full Stack Web Developer',
      icon: <Code className="w-6 h-6" />,
      color: 'cyan',
    },
    {
      name: 'Ammar Manzoor',
      role: 'AI Engineer',
      icon: <Brain className="w-6 h-6" />,
      color: 'pink',
    },
    {
      name: 'Affan Shafiq',
      role: 'AI Engineer',
      icon: <Cpu className="w-6 h-6" />,
      color: 'indigo',
    },
  ];

  const techStack = [
    { name: 'React.js', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Recharts', category: 'Visualization' },
    { name: 'Leaflet.js', category: 'Mapping' },
    { name: 'Python/Flask', category: 'Backend' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Vite', category: 'Build Tool' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-heading text-white mb-6 tracking-tight">
            About <span className="text-primary">TechXonomy</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-body leading-relaxed">
            A team of passionate developers and engineers building innovative solutions for
            disaster management in Pakistan.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-background-light/50 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-20 border border-white/5 shadow-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <h2 className="text-3xl font-bold font-heading text-white mb-8 text-center relative z-10">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6 font-body">
                The Pakistan Disaster Management Ecosystem (PDME) is our contribution to making
                Pakistan more resilient against natural disasters. We believe that technology,
                when combined with accurate data and intelligent analysis, can save lives.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed font-body">
                Our platform integrates decades of historical disaster data, real-time monitoring,
                climate analytics, and AI-powered predictions to provide authorities with
                actionable intelligence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-6 rounded-xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-400">Monitoring</div>
              </div>
              <div className="bg-background/50 p-6 rounded-xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-gray-400">Data Driven</div>
              </div>
              <div className="bg-background/50 p-6 rounded-xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-risk-medium mb-2">AI</div>
                <div className="text-sm text-gray-400">Powered</div>
              </div>
              <div className="bg-background/50 p-6 rounded-xl border border-white/5 text-center">
                <div className="text-3xl font-bold text-risk-low mb-2">Open</div>
                <div className="text-sm text-gray-400">Access</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-heading text-white mb-12 text-center">Meet Our Team</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-background-light/30 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-primary/30 transition-all shadow-lg group"
              >
                <div className={`w-20 h-20 rounded-full bg-${member.color}-500/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${member.color}-400`}>{member.icon}</div>
                </div>
                <h3 className="text-xl font-bold font-heading text-white text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 text-center font-body mb-4">{member.role}</p>
                
                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                  <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <div className="bg-background-light/30 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold font-heading text-white mb-8 text-center">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-background rounded-lg px-6 py-3 border border-white/5 hover:border-primary/50 transition-colors"
              >
                <div className="text-lg font-semibold text-white mb-1">{tech.name}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{tech.category}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center border-t border-white/5 pt-8">
          <p className="text-gray-500 font-body">
            Built with ❤️ by TechXonomy for a safer Pakistan
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
