import { Platform, Text } from 'react-native';
import { ScrewStylesLocal } from '../../style';
import { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useApiMutation, useGlobalApiState } from '../../../front/src/Model';

const Screw = ({
  id,
  styles,
  screwSound,
  bolt,
  nuts,
  screwShape,
  highlight,
  check,
  // onDeleteTrigger,
  isDeleteState,
}: {
  id: number;
  styles: ScrewStylesLocal;
  screwSound: string;
  bolt: string;
  nuts: string[];
  screwShape: string;
  highlight: boolean;
  check: boolean;
  // onDeleteTrigger?: (deleteId: number) => void;
  isDeleteState?: boolean;
}) => {
  const { mutation, isSuccess, isLoading, isError, responseData } =
    useApiMutation('POST');

  const mode = useSelector((state: RootState) => state.setToolMode.tool);
  const [isMethod, setMethod] = useState<'POST' | 'PUT' | 'DELETE'>('POST');
  const [isHidden, setHidden] = useState<boolean>(
    typeof isDeleteState === 'boolean' ? isDeleteState : false,
  );
  const [isChecked, setChecked] = useState<boolean>(check);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [isHighlighted, setHighlighted] = useState<boolean>(highlight);

  const { isSuccess: toolSuccess, toolModeActive } = useGlobalApiState({
    id,
    method: isMethod,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('✅Response:', responseData);
    }
    if (isLoading) {
      console.log('isLoading..');
    }
    if (isError) {
      console.log('isError');
    }
    if (toolSuccess && mode.includes('deleted') && isMethod === 'DELETE') {
      setHidden(!isHidden);
    }
  }, [isSuccess, isLoading, isError, toolSuccess, mode, isMethod]);

  if (Platform.OS === 'web') {
    const onCheckboxChange = () => {
      setChecked(!isChecked);
    };

    const onScrewSelected = () => {
      setMethod('DELETE');
      if (mode.includes('deleted')) {
        toolModeActive('deleted');
        setSelected(!isSelected);
      }
    };

    const onHighlight = () => {
      setMethod('POST');
      if (mode.includes('highlight')) {
        console.log('하이라이트 모드 활성화 상태:', mode.includes('highlight'));
        toolModeActive('highlight');
        setHighlighted(!isHighlighted);
      } else {
        console.log(
          '하이라이트 모드 비활성화 상태:',
          mode.includes('highlight'),
        );
        setHighlighted(false);
      }
    };

    // const temp = true;

    const onChecked = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      mutation.mutate(
        {
          mutateUrl: `https://13.209.113.229.nip.io/api/word/check/${id}`,
          mutateNucleus: {
            word: bolt,
            check: true,
          },
        },
        {
          onSuccess: () => {
            console.log('✅Check 완료');
          },
        },
      );
    };
    if (isHidden) return null;

    return (
      <div
        id={styles.container}
        className={isSelected ? styles.checked : styles.unchecked}
        onClick={() => {
          if (mode.includes('deleted')) {
            console.log('deleted');
            onScrewSelected();
          } else if (mode.includes('highlight')) {
            console.log('highlight');
            onHighlight();
          }
        }}
      >
        <div id={styles.contents}>
          <span id={styles.screwSound}>{screwSound}</span>
          <div id={styles.bolt}>
            <span className={isHighlighted ? styles.checked : ''}>
              {mode.includes('eng') ||
              mode.includes('deleted') ||
              mode.includes('highlight')
                ? bolt
                : null}
            </span>
          </div>
          <div id={styles.nuts}>
            {nuts.map((nut, index) => (
              <span key={index}>
                {mode.includes('kor') ||
                mode.includes('deleted') ||
                mode.includes('highlight') ? (
                  <span
                    className={`${styles.nut} ${isHighlighted ? styles.checked : ''}`}
                  >
                    {nut}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
          <span id={styles.screwShape}>{screwShape}</span>
        </div>
        <div id={styles.buttonContents}>
          {!mode.includes('deleted') ? (
            <input
              id={styles.button}
              className={isChecked ? styles.checked : styles.unchecked}
              type='checkbox'
              checked={isChecked}
              onChange={onCheckboxChange}
              onClick={onChecked}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return <Text style={{ color: '#fff' }}>This is None!</Text>;
};

export default Screw;
