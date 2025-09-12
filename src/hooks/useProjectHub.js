import { useProjectHubContext } from '../features/projectHub/context';

export default function useProjectHub() {
    const ctx = useProjectHubContext();
    if (!ctx) throw new Error('useProjectHub must be used within ProjectHubProvider');
    return ctx;
}
