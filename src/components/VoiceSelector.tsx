import voices from '@/utils/voices'
import { ChangeEvent, FC, useCallback, useEffect, useMemo } from 'react'
import Select, { SelectOption } from './Select'

export type VoiceConfig = {
  person?: string
  name: string
  type?: string
}

interface Props {
  voiceConfig: VoiceConfig
  onChange: (voiceConfig: VoiceConfig) => void
}

const VoiceSelector: FC<Props> = ({ voiceConfig, onChange }) => {
  const voicesOptions = useMemo<SelectOption[]>(
    () => voices.map((voice) => ({ value: voice.name, label: `${voice.name} (${voice.types.length} types)` })),
    [],
  )

  const voiceTypeOptions = useMemo<SelectOption[]>(() => {
    const voice = voices.find((voice) => voice.name === voiceConfig.name)
    return voice?.types.map((type) => ({ value: type, label: type })) ?? []
  }, [voiceConfig])

  useEffect(() => {
    const voice = voices.find((voice) => voice.name === voiceConfig.name)
    if (voice && voice.types.length !== 0) {
      onChange({ ...voiceConfig, type: voice.types[0] })
    } else {
      onChange({ ...voiceConfig, type: undefined })
    }

    // eslint-disable-next-line
  }, [voiceConfig.name])

  const handleChangeVoice = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => onChange({ ...voiceConfig, name: e.target.value }),
    [voiceConfig, onChange],
  )
  const handleChangeVoiceType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => onChange({ ...voiceConfig, type: e.target.value }),
    [voiceConfig, onChange],
  )

  return (
    <div>
      <label className='block text-sm font-medium mb-1 text-gray-700'>{voiceConfig.person || 'Unknown person'}</label>
      <div className='flex gap-4 items-center p-3 bg-white rounded shadow'>
        <Select options={voicesOptions} value={voiceConfig.name} onChange={handleChangeVoice} />
        {voiceTypeOptions.length !== 0 && <Select options={voiceTypeOptions} value={voiceConfig.type} onChange={handleChangeVoiceType} />}
      </div>
    </div>
  )
}

export default VoiceSelector
