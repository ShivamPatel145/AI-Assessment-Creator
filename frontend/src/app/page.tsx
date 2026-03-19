'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGuard from '@/components/AuthGuard';

function HomeContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { formData, setFormField, createAssignment, isSubmitting } = useAssignmentStore();
  
  const [qTypes, setQTypes] = useState([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: '4', type: 'Numerical Problems', count: 5, marks: 5 }
  ]);

  const handleUpdate = (index: number, field: string, val: number) => {
    const newTypes = [...qTypes];
    newTypes[index] = { ...newTypes[index], [field]: Math.max(1, val) };
    setQTypes(newTypes);
  };

  const removeType = (id: string) => {
    setQTypes(qTypes.filter(q => q.id !== id));
  };

  const addType = () => {
    setQTypes([
      ...qTypes, 
      { id: Date.now().toString(), type: 'New Custom Question', count: 1, marks: 1 }
    ]);
  };

  const totalQ = qTypes.reduce((a, b) => a + b.count, 0);
  const totalM = qTypes.reduce((a, b) => a + (b.count * b.marks), 0);

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append('title', 'Generated Assessment ' + new Date().toLocaleDateString());
      fd.append('subject', 'General Subject');
      fd.append('grade', 'Standard');
      fd.append('dueDate', formData.dueDate || new Date().toISOString());
      fd.append('numberOfQuestions', String(totalQ));
      fd.append('totalMarks', String(totalM));
      fd.append('additionalInstructions', formData.additionalInstructions);
      
      const qTypesMapped = qTypes.map(q => {
        if (q.type.includes('Multiple')) return 'mcq';
        if (q.type.includes('Short')) return 'short_answer';
        if (q.type.includes('Diagram')) return 'long_answer';
        return 'short_answer';
      });
      
      fd.append('questionTypes', JSON.stringify(qTypesMapped));
      if (formData.file) fd.append('file', formData.file);

      const id = await createAssignment(fd);
      router.push(`/assessment/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <motion.div className="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <TopBar title="Assignment" />
        
        <div className="page-container">
          <motion.div 
            className="form-container"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.98 },
              visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="form-section-title" style={{ fontSize: 20 }}>Create Assignment</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Set up a new assignment for your students</div>
              <div style={{ width: '100%', height: 1, background: 'var(--border-strong)', margin: '24px 0' }}></div>
              <div className="form-section-title" style={{ textAlign: 'left' }}>Assignment Details</div>
              <div className="form-section-subtitle" style={{ textAlign: 'left' }}>Basic information about your assignment</div>
            </motion.div>

            <motion.div variants={itemVariants} className="file-upload-box" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" ref={fileInputRef} style={{ display: 'none' }} 
                onChange={(e) => setFormField('file', e.target.files?.[0] || null)}
              />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="upload-icon">☁️</motion.div>
              <div className="upload-text">
                {formData.file ? formData.file.name : 'Choose a file or drag & drop it here'}
              </div>
              <div className="upload-hint">JPEG, PNG, upto 10MB</div>
              <button className="btn-browse">Browse Files</button>
            </motion.div>
            <motion.div variants={itemVariants} style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, marginTop: -16 }}>
              Upload images of your preferred document/image
            </motion.div>

            <motion.div variants={itemVariants} className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.dueDate}
                onChange={(e) => setFormField('dueDate', e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="form-group">
              <div className="type-header">
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Question Type</span>
              </div>

              <AnimatePresence>
                {qTypes.map((q, idx) => (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 50, height: 0, margin: 0 }}
                    className="question-type-card"
                  >
                    <button onClick={() => removeType(q.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}>×</button>
                    <select value={q.type} onChange={(e) => {
                      const newT = [...qTypes]; newT[idx].type = e.target.value; setQTypes(newT);
                    }}>
                      <option>Multiple Choice Questions</option>
                      <option>Short Questions</option>
                      <option>Diagram/Graph-Based Questions</option>
                      <option>Numerical Problems</option>
                      <option>New Custom Question</option>
                    </select>
                    
                    <div className="type-config-row">
                      <div className="type-config-col">
                        No. of Questions
                        <div className="number-stepper">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdate(idx, 'count', q.count - 1)}>-</motion.button>
                          <motion.input key={`c-${q.count}`} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} type="text" readOnly value={`${q.count} +`} />
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdate(idx, 'count', q.count + 1)}>+</motion.button>
                        </div>
                      </div>
                      
                      <div className="type-config-col">
                        Marks
                        <div className="number-stepper">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdate(idx, 'marks', q.marks - 1)}>-</motion.button>
                          <motion.input key={`m-${q.marks}`} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} type="text" readOnly value={`${q.marks} +`} />
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleUpdate(idx, 'marks', q.marks + 1)}>+</motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-add-type" onClick={addType}>
                <span style={{ fontSize: 16, paddingRight: 4 }}>+</span> Add Question Type
              </motion.button>

              <div className="totals-section">
                Total Questions: <motion.span key={totalQ} initial={{ scale: 1.2, color: 'var(--brand-orange)' }} animate={{ scale: 1, color: 'var(--text-secondary)' }}>{totalQ}</motion.span><br/>
                Total Marks: <motion.span key={totalM} initial={{ scale: 1.2, color: 'var(--brand-orange)' }} animate={{ scale: 1, color: 'var(--text-secondary)' }}>{totalM}</motion.span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="form-group" style={{ marginTop: 24 }}>
              <label className="form-label" style={{ fontSize: 13 }}>Additional Information (For better output)</label>
              <textarea 
                className="form-textarea" 
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={formData.additionalInstructions}
                onChange={(e) => setFormField('additionalInstructions', e.target.value)}
              ></textarea>
            </motion.div>

            <motion.div variants={itemVariants} className="form-footer">
              <motion.button whileHover={{ backgroundColor: '#f3f4f6' }} whileTap={{ scale: 0.95 }} className="btn-nav-prev" onClick={() => router.push('/assignments')}>← Previous</motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} 
                whileTap={{ scale: 0.95 }} 
                className="btn-nav-next" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                animate={isSubmitting ? { opacity: 0.7 } : { opacity: 1 }}
              >
                {isSubmitting ? 'Generating...' : 'Next →'}
              </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return <AuthGuard><HomeContent /></AuthGuard>;
}

