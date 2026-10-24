import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SmsLog {
  id: string
  date: string
  message: string
  recipients: string
  delivered: number
  total: number
  deliveryPercent: number
  status: 'ok' | 'partial'
}

export const useMessagesStore = defineStore('messages', () => {
  const totalSentThisMonth = ref(1284)

  const alertSettings = ref({
    absence3days: true,
    bulletinPublished: true,
    missingNotes: true,
    correctionApproved: true,
    repeatedLate: true,
  })

  const smsLog = ref<SmsLog[]>([
    { id: 'm1', date: '15 janv. 09:00', message: 'Alertes d\'absence de 3 jours', recipients: '3 familles', delivered: 3, total: 3, deliveryPercent: 100, status: 'ok' },
    { id: 'm2', date: '6 nov. 10:00', message: 'Bulletins de la période 1', recipients: '398 familles', delivered: 390, total: 398, deliveryPercent: 98, status: 'ok' },
    { id: 'm3', date: '4 janv. 10:30', message: 'Reprise des cours le 5 janvier', recipients: 'Toute l\'école', delivered: 247, total: 268, deliveryPercent: 92, status: 'partial' },
  ])

  const smsPreview = ref('LongiPlus : Les examens du 1er semestre commencent le lundi 25 janvier à 7h30. Arrivée des élèves à 7h00 avec leur matériel. C.S. Mwinda')

  return { totalSentThisMonth, alertSettings, smsLog, smsPreview }
})
