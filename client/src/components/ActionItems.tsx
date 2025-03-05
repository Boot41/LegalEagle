import React, { useState, useEffect } from 'react';
import { CheckCircle, ClipboardList, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define interface for Action Item
interface ActionItem {
    id: string;
    document_id: string;
    title: string;  
    description: string;
    priority: string;
    assigned_to?: string;
    due_date: string;
}

const ActionItems: React.FC = () => {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchActionItems = async () => {
            try {
                console.log('Fetching action items...');
                const response = await fetch('http://localhost:8080/action-items');
                if (!response.ok) {
                    console.error(`Failed to fetch action items. Status: ${response.status}`);
                    throw new Error('Failed to fetch action items');
                }
                const data = await response.json();
                console.log(`Fetched ${data.items?.length || 0} action items`);
                setActionItems(data.items || []);
            } catch (error) {
                console.error('Error fetching action items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActionItems();
    }, []);

    const handleComplete = async (id: string) => {
        try {
            console.log(`Attempting to complete action item: ${id}`);
            const response = await fetch(`http://localhost:8080/action-items/${id}/complete`, {
                method: 'PUT',
            });
            if (!response.ok) {
                console.error(`Failed to complete action item. Status: ${response.status}`);
                throw new Error('Failed to complete action');
            }
            console.log(`Successfully completed action item: ${id}`);
            setActionItems(actionItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error completing action:', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-pulse-slow text-[var(--color-primary)]">
                <ClipboardList size={32} />
            </div>
            <span className="ml-3 text-[var(--color-text-secondary)]">Loading action items...</span>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-7xl mx-auto"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text flex items-center">
                    <ClipboardList className="mr-3 text-[var(--color-primary)]" /> 
                    Action Items
                </h2>
                <div className="glass-card px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary)]">
                    {actionItems.length} pending items
                </div>
            </div>

            <AnimatePresence>
                {actionItems.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-xl p-8 text-center"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
                                <CheckCircle className="text-[var(--color-primary)]" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                            <p className="text-[var(--color-text-secondary)] max-w-md">
                                No pending action items. All compliance issues have been addressed.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-xl overflow-hidden shadow-lg"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                                        <th className="p-4 text-left text-[var(--color-text-secondary)] font-medium">Document</th>
                                        <th className="p-4 text-left text-[var(--color-text-secondary)] font-medium">Action Required</th>
                                        <th className="p-4 text-left text-[var(--color-text-secondary)] font-medium">Priority</th>
                                        <th className="p-4 text-left text-[var(--color-text-secondary)] font-medium">Assigned To</th>
                                        <th className="p-4 text-left text-[var(--color-text-secondary)] font-medium">Due Date</th>
                                        <th className="p-4 text-center text-[var(--color-text-secondary)] font-medium">Complete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actionItems.map((item, index) => (
                                        <motion.tr 
                                            key={item.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <FileText size={18} className="text-[var(--color-text-secondary)] mr-2" />
                                                    <span className="font-medium text-[var(--color-text-primary)]">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[var(--color-text-primary)]">{item.description}</td>
                                            <td className="p-4">
                                                <PriorityBadge priority={item.priority} />
                                            </td>
                                            <td className="p-4 text-[var(--color-text-secondary)]">
                                                {item.assigned_to || 'Unassigned'}
                                            </td>
                                            <td className="p-4 text-[var(--color-text-secondary)]">
                                                {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No date set'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => handleComplete(item.id)} 
                                                    className="hover-lift inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20"
                                                    title="Mark as Complete"
                                                >
                                                    <CheckCircle 
                                                        className="text-[var(--color-primary)]" 
                                                        size={18} 
                                                    />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Priority Badge component inspired by Supabase design
const PriorityBadge = ({ priority }: { priority: string }) => {
    const badgeStyles = {
        'high': 'bg-[#E54F4F]/10 text-[#E54F4F] border border-[#E54F4F]/20',
        'medium': 'bg-[#F2994A]/10 text-[#F2994A] border border-[#F2994A]/20',
        'low': 'bg-[#2C9ED4]/10 text-[#2C9ED4] border border-[#2C9ED4]/20',
        'default': 'bg-gray-100/10 text-gray-400 border border-gray-500/20'
    };

    return (
        <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
            transition-all duration-300 ease-in-out
            ${badgeStyles[priority.toLowerCase() as keyof typeof badgeStyles] || badgeStyles.default}
            hover:shadow-md hover:scale-105
        `}>
            {priority.toUpperCase()}
        </div>
    );
};

export default ActionItems;
