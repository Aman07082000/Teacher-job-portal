import pool from '../config/db.js';

// Sample job data from various platforms for testing
const sampleJobs = [
  // Indeed jobs
  {
    platform: 'Indeed',
    title: 'High School Mathematics Teacher',
    description: 'We are seeking a passionate Mathematics Teacher to join our team. The ideal candidate will have a strong background in mathematics and experience teaching high school students. Responsibilities include developing lesson plans, assessing student performance, and maintaining classroom discipline.',
    location: 'New York, NY',
    subject_expertise: 'Mathematics',
    salary_range: '$50,000 - $70,000',
    school_name: 'Lincoln High School',
    address: '123 Education St, New York, NY 10001'
  },
  {
    platform: 'Indeed',
    title: 'Elementary School Teacher - All Subjects',
    description: 'Join our elementary school as a general education teacher. Teach core subjects including reading, writing, mathematics, science, and social studies. Create engaging lesson plans and foster a positive learning environment.',
    location: 'Los Angeles, CA',
    subject_expertise: 'General Education',
    salary_range: '$45,000 - $60,000',
    school_name: 'Sunset Elementary',
    address: '456 Learning Ave, Los Angeles, CA 90210'
  },
  {
    platform: 'Indeed',
    title: 'Science Teacher (Biology/Chemistry)',
    description: 'Experienced science teacher needed for middle school. Teach biology and chemistry courses, conduct laboratory experiments, and prepare students for state assessments.',
    location: 'Chicago, IL',
    subject_expertise: 'Science',
    salary_range: '$48,000 - $65,000',
    school_name: 'Riverside Middle School',
    address: '789 Science Blvd, Chicago, IL 60601'
  },

  // LinkedIn jobs
  {
    platform: 'LinkedIn',
    title: 'Special Education Teacher',
    description: 'Special education teacher position available. Work with students with diverse learning needs, develop individualized education plans (IEPs), and collaborate with support staff.',
    location: 'Boston, MA',
    subject_expertise: 'Special Education',
    salary_range: '$52,000 - $75,000',
    school_name: 'Beacon Academy',
    address: '321 Support Way, Boston, MA 02101'
  },
  {
    platform: 'LinkedIn',
    title: 'English Language Arts Teacher',
    description: 'ELA teacher for high school English courses. Teach literature, writing, grammar, and critical thinking skills. Experience with AP courses preferred.',
    location: 'Seattle, WA',
    subject_expertise: 'English',
    salary_range: '$49,000 - $68,000',
    school_name: 'Cascade High School',
    address: '654 Literature Ln, Seattle, WA 98101'
  },

  // Glassdoor jobs
  {
    platform: 'Glassdoor',
    title: 'Physical Education Teacher',
    description: 'PE teacher needed for K-8 program. Teach physical education, health education, and promote wellness. Coach sports teams and organize fitness activities.',
    location: 'Denver, CO',
    subject_expertise: 'Physical Education',
    salary_range: '$42,000 - $58,000',
    school_name: 'Mountain View Elementary',
    address: '987 Fitness Dr, Denver, CO 80202'
  },
  {
    platform: 'Glassdoor',
    title: 'Art Teacher',
    description: 'Creative art teacher for elementary and middle school. Teach various art mediums including drawing, painting, sculpture, and digital art. Experience with diverse age groups required.',
    location: 'Austin, TX',
    subject_expertise: 'Art',
    salary_range: '$44,000 - $62,000',
    school_name: 'Creative Arts Academy',
    address: '147 Imagination St, Austin, TX 78701'
  },

  // SchoolSpring jobs
  {
    platform: 'SchoolSpring',
    title: 'Music Teacher - Band Director',
    description: 'Band director and music teacher position. Direct marching band, jazz ensemble, and teach music theory. Experience with various instruments preferred.',
    location: 'Nashville, TN',
    subject_expertise: 'Music',
    salary_range: '$46,000 - $64,000',
    school_name: 'Harmony High School',
    address: '258 Melody Rd, Nashville, TN 37201'
  },
  {
    platform: 'SchoolSpring',
    title: 'Foreign Language Teacher (Spanish)',
    description: 'Spanish teacher for middle and high school. Teach conversational Spanish, grammar, and culture. Native or near-native proficiency required.',
    location: 'Miami, FL',
    subject_expertise: 'Spanish',
    salary_range: '$47,000 - $66,000',
    school_name: 'International Academy',
    address: '369 Language Ave, Miami, FL 33101'
  },

  // Education Week jobs
  {
    platform: 'Education Week',
    title: 'Computer Science Teacher',
    description: 'CS teacher to introduce coding, programming, and computational thinking. Teach Python, JavaScript, and robotics. Technology integration experience required.',
    location: 'San Francisco, CA',
    subject_expertise: 'Computer Science',
    salary_range: '$55,000 - $78,000',
    school_name: 'Tech Valley High',
    address: '741 Code St, San Francisco, CA 94102'
  },
  {
    platform: 'Education Week',
    title: 'Social Studies Teacher',
    description: 'History and social studies teacher for high school. Teach world history, US history, government, and economics. Passion for history and current events required.',
    location: 'Washington, DC',
    subject_expertise: 'Social Studies',
    salary_range: '$51,000 - $72,000',
    school_name: 'Capital History High',
    address: '852 Democracy Dr, Washington, DC 20001'
  },

  // Additional diverse jobs
  {
    platform: 'Indeed',
    title: 'Early Childhood Education Teacher',
    description: 'Preschool teacher for 3-5 year olds. Create developmentally appropriate activities, assess child development, and communicate with parents.',
    location: 'Portland, OR',
    subject_expertise: 'Early Childhood',
    salary_range: '$38,000 - $52,000',
    school_name: 'Little Learners Preschool',
    address: '963 Play St, Portland, OR 97201'
  },
  {
    platform: 'LinkedIn',
    title: 'ESL Teacher',
    description: 'English as a Second Language teacher. Work with non-native English speakers, develop language acquisition skills, and cultural integration.',
    location: 'Houston, TX',
    subject_expertise: 'ESL',
    salary_range: '$43,000 - $61,000',
    school_name: 'Global Language Academy',
    address: '159 Culture Blvd, Houston, TX 77001'
  },
  {
    platform: 'Glassdoor',
    title: 'STEM Teacher',
    description: 'Integrated STEM teacher combining science, technology, engineering, and mathematics. Lead project-based learning and interdisciplinary activities.',
    location: 'Raleigh, NC',
    subject_expertise: 'STEM',
    salary_range: '$53,000 - $71,000',
    school_name: 'Innovation STEM School',
    address: '357 Discovery Way, Raleigh, NC 27601'
  },

  // Additional jobs from various platforms
  {
    platform: 'Indeed',
    title: 'Middle School History Teacher',
    description: 'Dynamic history teacher needed for grades 6-8. Teach world history, American history, and geography. Experience with project-based learning preferred.',
    location: 'Philadelphia, PA',
    subject_expertise: 'Social Studies',
    salary_range: '$48,000 - $66,000',
    school_name: 'Liberty Middle School',
    address: '741 Independence St, Philadelphia, PA 19106'
  },
  {
    platform: 'LinkedIn',
    title: 'French Language Teacher',
    description: 'Native or near-native French speaker needed to teach French language and culture. Experience with FLES program and immersion teaching methods.',
    location: 'New Orleans, LA',
    subject_expertise: 'French',
    salary_range: '$45,000 - $63,000',
    school_name: 'International Language Academy',
    address: '258 Bourbon St, New Orleans, LA 70116'
  },
  {
    platform: 'SchoolSpring',
    title: 'Drama and Theater Arts Teacher',
    description: 'Passionate theater teacher to direct school plays, teach acting techniques, and manage the drama club. Experience with technical theater and stage management.',
    location: 'Las Vegas, NV',
    subject_expertise: 'Drama',
    salary_range: '$46,000 - $64,000',
    school_name: 'Spotlight Performing Arts',
    address: '369 Showtime Blvd, Las Vegas, NV 89101'
  },
  {
    platform: 'Education Week',
    title: 'Gifted and Talented Program Teacher',
    description: 'Specialized teacher for gifted students. Develop advanced curriculum, differentiate instruction, and provide enrichment activities for high-achieving students.',
    location: 'San Diego, CA',
    subject_expertise: 'Gifted Education',
    salary_range: '$52,000 - $70,000',
    school_name: 'Excellence Academy',
    address: '852 Advanced Ln, San Diego, CA 92101'
  },
  {
    platform: 'Indeed',
    title: 'Career and Technical Education Teacher',
    description: 'CTE teacher specializing in business education. Teach entrepreneurship, marketing, and business management. Industry experience preferred.',
    location: 'Detroit, MI',
    subject_expertise: 'Business Education',
    salary_range: '$49,000 - $67,000',
    school_name: 'Career Technical High',
    address: '963 Industry Dr, Detroit, MI 48201'
  },
  {
    platform: 'Glassdoor',
    title: 'Environmental Science Teacher',
    description: 'Environmental science teacher for high school. Teach ecology, environmental issues, and sustainability. Field trip coordination and lab management experience required.',
    location: 'Portland, OR',
    subject_expertise: 'Environmental Science',
    salary_range: '$50,000 - $68,000',
    school_name: 'Green Valley High School',
    address: '147 Ecology Way, Portland, OR 97201'
  },
  {
    platform: 'LinkedIn',
    title: 'Reading Specialist',
    description: 'Reading specialist to support struggling readers and provide literacy interventions. Experience with reading assessments and individualized instruction plans.',
    location: 'Baltimore, MD',
    subject_expertise: 'Reading',
    salary_range: '$51,000 - $69,000',
    school_name: 'Literacy First Elementary',
    address: '258 Reading St, Baltimore, MD 21201'
  },
  {
    platform: 'SchoolSpring',
    title: 'Technology Integration Specialist',
    description: 'Tech integration specialist to support teachers with educational technology implementation. Experience with Google Classroom, learning management systems, and digital pedagogy.',
    location: 'Salt Lake City, UT',
    subject_expertise: 'Educational Technology',
    salary_range: '$54,000 - $72,000',
    school_name: 'Digital Learning Academy',
    address: '369 Tech Blvd, Salt Lake City, UT 84101'
  },
  {
    platform: 'Education Week',
    title: 'Bilingual Education Teacher (Spanish/English)',
    description: 'Bilingual teacher for dual language program. Teach content in both Spanish and English. Native proficiency in both languages required.',
    location: 'El Paso, TX',
    subject_expertise: 'Bilingual Education',
    salary_range: '$47,000 - $65,000',
    school_name: 'Border Bilingual Academy',
    address: '741 Bridge St, El Paso, TX 79901'
  },
  {
    platform: 'Indeed',
    title: 'Health and Wellness Teacher',
    description: 'Health education teacher covering nutrition, mental health, and physical wellness. Coordinate with PE department and school wellness program.',
    location: 'Minneapolis, MN',
    subject_expertise: 'Health Education',
    salary_range: '$46,000 - $64,000',
    school_name: 'Wellness Middle School',
    address: '852 Health Way, Minneapolis, MN 55401'
  },
  {
    platform: 'Glassdoor',
    title: 'Library Media Specialist',
    description: 'School librarian to manage library resources, teach information literacy, and support research skills. Experience with digital libraries and database management.',
    location: 'Pittsburgh, PA',
    subject_expertise: 'Library Science',
    salary_range: '$48,000 - $66,000',
    school_name: 'Knowledge Library High',
    address: '963 Book Blvd, Pittsburgh, PA 15201'
  },
  {
    platform: 'LinkedIn',
    title: 'Speech and Language Pathologist',
    description: 'Speech therapist to provide speech and language services to students with communication disorders. Experience with articulation, language, and fluency disorders.',
    location: 'Milwaukee, WI',
    subject_expertise: 'Speech Therapy',
    salary_range: '$55,000 - $75,000',
    school_name: 'Communication Center School',
    address: '147 Speech St, Milwaukee, WI 53201'
  },
  {
    platform: 'SchoolSpring',
    title: 'Counselor (School Guidance)',
    description: 'School counselor to provide academic, career, and personal counseling. Experience with crisis intervention and student support services.',
    location: 'Omaha, NE',
    subject_expertise: 'School Counseling',
    salary_range: '$50,000 - $68,000',
    school_name: 'Guidance High School',
    address: '258 Support Ave, Omaha, NE 68101'
  },
  {
    platform: 'Education Week',
    title: 'Automotive Technology Teacher',
    description: 'Auto tech teacher for vocational program. Teach engine repair, automotive systems, and maintenance. ASE certification preferred.',
    location: 'Tucson, AZ',
    subject_expertise: 'Automotive Technology',
    salary_range: '$52,000 - $70,000',
    school_name: 'Auto Tech Vocational',
    address: '369 Engine Dr, Tucson, AZ 85701'
  },
  {
    platform: 'Indeed',
    title: 'Culinary Arts Teacher',
    description: 'Culinary arts instructor for vocational program. Teach cooking techniques, food safety, and nutrition. Professional kitchen experience required.',
    location: 'Albuquerque, NM',
    subject_expertise: 'Culinary Arts',
    salary_range: '$45,000 - $63,000',
    school_name: 'Culinary Institute High',
    address: '741 Kitchen Way, Albuquerque, NM 87101'
  },
  {
    platform: 'Glassdoor',
    title: 'Photography and Digital Media Teacher',
    description: 'Digital media teacher covering photography, video production, and graphic design. Experience with Adobe Creative Suite and digital storytelling.',
    location: 'Colorado Springs, CO',
    subject_expertise: 'Digital Media',
    salary_range: '$47,000 - $65,000',
    school_name: 'Media Arts Academy',
    address: '852 Pixel St, Colorado Springs, CO 80901'
  },
  {
    platform: 'LinkedIn',
    title: 'Psychology Teacher',
    description: 'Psychology teacher for high school AP Psychology course. Teach psychological theories, research methods, and human behavior. Advanced degree in psychology preferred.',
    location: 'Reno, NV',
    subject_expertise: 'Psychology',
    salary_range: '$49,000 - $67,000',
    school_name: 'Mind and Behavior High',
    address: '963 Psychology Blvd, Reno, NV 89501'
  },
  {
    platform: 'SchoolSpring',
    title: 'Sociology Teacher',
    description: 'Sociology teacher covering social structures, culture, and social issues. Experience with current events integration and critical thinking development.',
    location: 'Fresno, CA',
    subject_expertise: 'Sociology',
    salary_range: '$48,000 - $66,000',
    school_name: 'Social Sciences Academy',
    address: '147 Society St, Fresno, CA 93701'
  },
  {
    platform: 'Education Week',
    title: 'Economics Teacher',
    description: 'Economics teacher for high school. Teach micro and macro economics, personal finance, and economic systems. Business background preferred.',
    location: 'Wichita, KS',
    subject_expertise: 'Economics',
    salary_range: '$46,000 - $64,000',
    school_name: 'Economic Literacy High',
    address: '258 Finance Ave, Wichita, KS 67201'
  },
  {
    platform: 'Indeed',
    title: 'Philosophy and Ethics Teacher',
    description: 'Philosophy teacher covering ethics, logic, and critical thinking. Experience with Socratic method and debate facilitation.',
    location: 'Providence, RI',
    subject_expertise: 'Philosophy',
    salary_range: '$50,000 - $68,000',
    school_name: 'Critical Thinking Academy',
    address: '369 Reason Blvd, Providence, RI 02901'
  },
  {
    platform: 'Glassdoor',
    title: 'Journalism and Media Teacher',
    description: 'Journalism teacher managing school newspaper and media production. Teach writing, reporting, and digital media skills.',
    location: 'Boise, ID',
    subject_expertise: 'Journalism',
    salary_range: '$45,000 - $63,000',
    school_name: 'Media Communications High',
    address: '741 Press St, Boise, ID 83701'
  }
];

export const seedJobsFromPlatforms = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting job seeding from various platforms...');

    await client.query('BEGIN');

    // Get unique schools
    const schools = [...new Set(sampleJobs.map(job => job.school_name))];
    console.log(`📚 Processing ${schools.length} schools and ${sampleJobs.length} jobs...`);

    // Create school users in batch
    const schoolValues = [];
    const schoolEmails = [];

    for (const schoolName of schools) {
      const email = `${schoolName.toLowerCase().replace(/\s+/g, '')}@school.edu`;
      schoolEmails.push(email);
      schoolValues.push(`('${schoolName}', '${email}', 'hashedpassword', 'school')`);
    }

    // Insert school users (ignore conflicts)
    const schoolInsertQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES ${schoolValues.join(', ')}
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email
    `;

    const schoolResult = await client.query(schoolInsertQuery);
    console.log(`✅ Created/Found ${schoolResult.rows.length} school users`);

    // Get all school users (including existing ones)
    const allSchoolsResult = await client.query(
      'SELECT id, name FROM users WHERE role = $1',
      ['school']
    );

    const schoolMap = new Map();
    allSchoolsResult.rows.forEach(school => {
      schoolMap.set(school.name, school.id);
    });

    // Create school profiles in batch
    const profileValues = [];
    for (const schoolName of schools) {
      const schoolData = sampleJobs.find(job => job.school_name === schoolName);
      const schoolId = schoolMap.get(schoolName);
      if (schoolId && schoolData) {
        profileValues.push(`(${schoolId}, '${schoolName.replace(/'/g, "''")}', '${schoolData.address.replace(/'/g, "''")}')`);
      }
    }

    if (profileValues.length > 0) {
      const profileInsertQuery = `
        INSERT INTO school_profiles (user_id, school_name, address)
        VALUES ${profileValues.join(', ')}
        ON CONFLICT (user_id) DO NOTHING
      `;
      await client.query(profileInsertQuery);
      console.log(`✅ Created/Updated ${profileValues.length} school profiles`);
    }

    // Create jobs in batch
    const jobValues = [];
    for (const jobData of sampleJobs) {
      const schoolId = schoolMap.get(jobData.school_name);
      if (schoolId) {
        jobValues.push(`(${schoolId}, '${jobData.title.replace(/'/g, "''")}', '${jobData.description.replace(/'/g, "''")}', '${jobData.location}', '${jobData.subject_expertise}', '${jobData.salary_range}', true)`);
      }
    }

    if (jobValues.length > 0) {
      const jobInsertQuery = `
        INSERT INTO jobs (school_id, title, description, location, subject_expertise, salary_range, is_active)
        VALUES ${jobValues.join(', ')}
      `;
      const jobResult = await client.query(jobInsertQuery);
      console.log(`✅ Created ${jobResult.rowCount} jobs`);
    }

    await client.query('COMMIT');
    console.log(`🎉 Successfully seeded ${sampleJobs.length} jobs from ${schools.length} schools across multiple platforms!`);

    return { success: true, jobsCreated: sampleJobs.length, schoolsCreated: schools.length };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding jobs:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const clearAllJobs = async () => {
  const client = await pool.connect();

  try {
    console.log('🧹 Starting data clearing process...');

    await client.query('BEGIN');

    // Delete in correct order due to foreign key constraints
    const deleteResults = await Promise.all([
      client.query('DELETE FROM applications'),
      client.query('DELETE FROM jobs'),
      client.query('DELETE FROM school_profiles'),
      client.query('DELETE FROM teacher_profiles'),
      client.query("DELETE FROM users WHERE role = 'school'")
    ]);

    await client.query('COMMIT');

    const totalDeleted = deleteResults.reduce((sum, result) => sum + result.rowCount, 0);
    console.log(`✅ Cleared ${totalDeleted} records from database`);

    return { success: true, recordsDeleted: totalDeleted };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing jobs:', error);
    throw error;
  } finally {
    client.release();
  }
};