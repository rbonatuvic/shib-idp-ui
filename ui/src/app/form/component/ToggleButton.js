import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

export function ToggleButton ({ isOpen, onClick, disabled, children }) {
    return (
        <Button
            type="button"
            variant="outline-secondary"
            className="toggle-button"
            onClick={onClick}
            disabled={disabled}
            onMouseDown={e => {
                // Prevent input from losing focus.
                e.preventDefault();
            }}>
                {children}
            <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </Button>
    );
}

export default ToggleButton;