import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

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

    if (loading) return <div className="text-center py-4">Loading action items...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <AlertCircle className="mr-2" /> Action Items
            </h2>
            {actionItems.length === 0 ? (
                <p className="text-gray-500">No pending action items.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Document Title</th>
                                <th className="p-3 text-left">Action Name</th>
                                <th className="p-3 text-left">Priority</th>
                                <th className="p-3 text-left">Assigned To</th>
                                <th className="p-3 text-left">Due Date</th>
                                <th className="p-3 text-center">Complete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actionItems.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{item.title}</td>
                                    <td className="p-3">{item.description}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-white ${priorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="p-3">{item.assigned_to || 'Unassigned'}</td>
                                    <td className="p-3">{new Date(item.due_date).toLocaleDateString()}</td>
                                    <td className="p-3 text-center flex justify-center items-center">
                                        <button 
                                            onClick={() => handleComplete(item.id)} 
                                            className="hover:bg-green-100 rounded-full p-1 transition-colors"
                                            title="Mark as Complete"
                                        >
                                            <CheckCircle 
                                                className="text-green-500 hover:text-green-700" 
                                                size={24} 
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Helper functions
const priorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

export default ActionItems;
