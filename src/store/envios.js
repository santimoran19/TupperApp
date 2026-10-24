// Los cambios que se pueden hacer sin conexión, mandados con el cliente de Supabase de la app (ver envios-base.js).
import { supabase } from './base'
import { crearEnvios } from './envios-base'

export const ENVIOS = crearEnvios(supabase)
