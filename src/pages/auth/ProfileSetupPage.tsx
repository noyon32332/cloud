import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, X, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const SUGGESTED_SKILLS = [
  'Physics', 'Calculus', 'Thermodynamics', 'Data Structures', 'Chemistry',
  'Algorithms', 'Vector Calculus', 'Organic Chemistry', 'Classical Mechanics',
]

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
]

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [bio, setBio] = useState(user?.bio || '')
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || PRESET_AVATARS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    setIsSubmitting(true)
    try {
      if (user) {
        updateUser({
          ...user,
          avatar: avatarPreview,
          bio,
          skills,
        })
      }
      navigate('/dashboard')
    } catch (err: any) {
      setServerError(err.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set up your profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select an avatar and academic interests</p>
          </div>

          {serverError && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400 text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Choose Profile Avatar</p>
              <div className="flex items-center gap-3">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarPreview(av)}
                    className={`h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all ${
                      avatarPreview === av ? 'border-blue-600 ring-2 ring-blue-600/30 scale-105' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about your academic studies..."
                rows={3}
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              />
              <p className="text-xs text-slate-400 text-right">{bio.length}/200</p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Academic Interests & Skills</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200/50 dark:border-blue-800/50">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a subject/skill and press Enter"
                  disabled={skills.length >= 10}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim() || skills.length >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">Add up to 10 subjects</p>

              {/* Suggested Skills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="px-2.5 py-1 rounded-lg text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving profile...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
