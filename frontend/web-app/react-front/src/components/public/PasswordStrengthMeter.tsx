import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const rules = [
        { text: 'At least 8 characters long', test: (p: string) => p.length >= 8 },
        { text: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
        { text: 'Contains lowercase letter', test: (p: string) => /[a-z]/.test(p) },
        { text: 'Contains a number', test: (p: string) => /\d/.test(p) },
        { text: 'Contains a special character', test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
        { text: 'No spaces or tabs', test: (p: string) => !/[ \t]/.test(p) },
  ];
  const getPasswordStrength = (password: string): number => {
    return rules.filter(rule => rule.test(password)).length
  }

  const strength = getPasswordStrength(password)
  const percentage = (strength / rules.length) * 100

  const getColor = (percentage: number) => {
    if (percentage <= 25) return '#FF4136'
    if (percentage <= 50) return '#FF851B'
    if (percentage <= 75) return '#FFDC00'
    return '#2ECC40'
  }

  return (
    <div className="mt-2 space-y-2">
      <motion.div
        className="h-2 rounded-full bg-gray-200"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ backgroundColor: getColor(0) }}
          animate={{ backgroundColor: getColor(percentage) }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      <div className="space-y-1">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            className="flex items-center text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {rule.test(password) ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={rule.test(password) ? 'text-green-700' : 'text-gray-600'}>
              {rule.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}