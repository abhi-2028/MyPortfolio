import 'dotenv/config';

import mongoose from 'mongoose';

import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import Profile from '../src/models/Profile.js';
import Skill from '../src/models/Skill.js';
import Project from '../src/models/Project.js';
import Certificate from '../src/models/Certificate.js';
import Education from '../src/models/Education.js';

const seed = async () => {
  try {
    await connectDatabase();

    await Profile.findOneAndUpdate(
      {},
      {
      name: 'Abhirup Biswas',
      headline: 'a Programmer | a Web Developer | a Coder',
      bio: "I'm Abhirup Biswas, a 2nd-year Computer Engineering student at ICFAI University, Dehradun. I am passionate about problem-solving and focused on mastering Data Structures and Algorithms (DSA) in Java. I am also exploring the MERN stack and aim to secure an internship by my 3rd year.",
      profileImage: '/assets/myImg.jpeg',
      location: 'Dehradun, India',
      socialLinks: {
        linkedIn: 'https://www.linkedin.com/in/abhirup-biswas-260167322/',
        twitter: 'https://x.com/AbhirupCode',
      },
      resumeUrl: '/assets/Resume.pdf',
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );

    const seedSkills = [
      { name: 'HTML 5', category: 'Frontend', icon: 'html', displayOrder: 1 },
      { name: 'CSS 3', category: 'Frontend', icon: 'css', displayOrder: 2 },
      { name: 'Java', category: 'Programming', icon: 'java', displayOrder: 3 },
      { name: 'Bootstrap 5', category: 'Frontend', icon: 'bootstrap', displayOrder: 4 },
      { name: 'Git & Github', category: 'Tools', icon: 'git', displayOrder: 5 },
      { name: 'Javascript', category: 'Frontend', icon: 'javascript', displayOrder: 6 },
    ];
    await Promise.all(seedSkills.map((skill) =>
      Skill.findOneAndUpdate({ name: skill.name }, skill, { upsert: true, setDefaultsOnInsert: true }),
    ));

    const seedProjects = [
      {
        title: 'Spotify Clone - Music Player',
        slug: 'spotify-clone-music-player',
        image: '/assets/Project2Spotify.png',
        liveUrl: 'https://abhi-2028.github.io/Spotify-Clone-HTML-CSS-/',
        featured: true,
        displayOrder: 1,
      },
      {
        title: "TinDog - Dog's Love Life",
        slug: 'tindog-dogs-love-life',
        image: '/assets/Project1Tindog.png',
        liveUrl: 'https://abhi-2028.github.io/TinDog/',
        featured: true,
        displayOrder: 2,
      },
      {
        title: 'Spotify Clone - Music Player',
        slug: 'spotify-clone-music-player-duplicate',
        image: '/assets/Project2Spotify.png',
        liveUrl: 'https://abhi-2028.github.io/Spotify-Clone-HTML-CSS-/',
        featured: false,
        displayOrder: 3,
      },
      {
        title: 'Aeshtetic Calculator',
        slug: 'aeshtetic-calculator',
        image: '/assets/aesthetic calculator.png',
        liveUrl: 'https://aesthetic-calculator-eta.vercel.app/',
        featured: true,
        displayOrder: 4,
      },
      {
        title: 'Simon Says Game',
        slug: 'simon-says-game',
        image: '/assets/SimonSays.png',
        liveUrl: 'https://simon-game-xi-beryl.vercel.app',
        featured: true,
        displayOrder: 5,
      },
    ];
    await Promise.all(seedProjects.map((project) =>
      Project.findOneAndUpdate({ slug: project.slug }, project, { upsert: true, setDefaultsOnInsert: true }),
    ));

    await Certificate.findOneAndUpdate({
      title: 'DSA with Java',
    }, {
      title: 'DSA with Java',
      issuingOrganization: 'Apna College',
      issueDate: new Date('2025-07-01'),
      image: '/assets/certificate-sigma-70-683b0542b486128d080d455d (2).pdf',
      displayOrder: 1,
    }, { upsert: true, setDefaultsOnInsert: true });

    await Education.findOneAndUpdate({
      institution: 'ICFAI University, Dehradun',
    }, {
      institution: 'ICFAI University, Dehradun',
      degree: 'Computer Engineering',
      fieldOfStudy: 'Computer Engineering',
      description: '2nd-year student as stated in the existing portfolio.',
      displayOrder: 1,
    }, { upsert: true, setDefaultsOnInsert: true });

    console.log('Portfolio seed data created.');
  } finally {
    await disconnectDatabase();
  }
};

seed().catch((error) => {
  console.error(error);
  mongoose.disconnect();
  process.exitCode = 1;
});
