import React, {useState} from "react";
import styled from "styled-components";
import {AdminButton} from "../styles/AdminButton";
import {checkFolders, clearArchive, createArchive, updateArchive, recreateS3} from "../services/AdminService";

type ActionKey = 'update' | 'check' | 'clear' | 'create' | 'recreate';

interface ActionResult {
    ok: boolean;
    message?: string;
}

interface AdminAction {
    key: ActionKey;
    label: string;
    run: () => Promise<unknown>;
}

const ACTIONS: AdminAction[] = [
    {key: 'update', label: 'Update', run: updateArchive},
    {key: 'check', label: 'Check folders', run: checkFolders},
    {key: 'clear', label: 'Clear', run: clearArchive},
    {key: 'create', label: 'Create', run: createArchive},
    {key: 'recreate', label: 'Recreate S3', run: recreateS3},
];

const getErrorMessage = (error: unknown): string => {
    const status = (error as {response?: {status?: number}} | null)?.response?.status;
    return status !== undefined ? `Failed (${status})` : 'Request failed';
};

interface ActionItemProps {
    action: AdminAction;
    busy: boolean;
    anyBusy: boolean;
    result?: ActionResult;
    onClick: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({action, busy, anyBusy, result, onClick}) => {
    const statusText = !result ? '' : result.ok ? 'OK' : result.message;
    return (
        <ActionColumn>
            <AdminButton as="button" disabled={anyBusy} onClick={onClick}>
                {busy ? 'Running...' : action.label}
            </AdminButton>
            <StatusLine $ok={result?.ok}>{statusText}</StatusLine>
        </ActionColumn>
    );
};

const AdminPageComponent: React.FC = () => {

    const [busyAction, setBusyAction] = useState<ActionKey | null>(null);
    const [results, setResults] = useState<Partial<Record<ActionKey, ActionResult>>>({});

    const runAction = async (action: AdminAction) => {
        if (busyAction !== null) return;
        setBusyAction(action.key);
        try {
            await action.run();
            setResults(prev => ({...prev, [action.key]: {ok: true}}));
        } catch (error) {
            setResults(prev => ({...prev, [action.key]: {ok: false, message: getErrorMessage(error)}}));
        } finally {
            setBusyAction(null);
        }
    };

    return (
        <AdminStyled>
            <div >
                <nav>
                    {ACTIONS.map(action => (
                        <ActionItem
                            key={action.key}
                            action={action}
                            busy={busyAction === action.key}
                            anyBusy={busyAction !== null}
                            result={results[action.key]}
                            onClick={() => runAction(action)}
                        />
                    ))}
                </nav>
            </div>
        </AdminStyled>
    );
}

export default AdminPageComponent;


const AdminStyled = styled.div`

    display: flex;          // Включаем Flexbox
    justify-content: center; // Центрируем контент по горизонтали
    //align-items: center;     // Центрируем контент по вертикали
    height: 100vh;           // Полная высота экрана

    nav {
        display: flex;        // Используем Flexbox также для nav
        gap: 20px;            // Расстояние между кнопками
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;

const ActionColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatusLine = styled.div<{ $ok?: boolean; children?: React.ReactNode }>`
    min-height: 20px;
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
    color: ${({theme, $ok}) => ($ok === undefined ? theme.colors.text : $ok ? theme.colors.success : theme.colors.error)};
`;
