import React, { Component } from 'react';
import { View, Text, Platform, Switch as RNSwitch, TextStyle } from 'react-native';

import { AppColors } from '@theme';
import styles from './styles';
/* Types ==================================================================== */
interface Props {
    testID?: string;
    title?: string;
    titleStyle?: TextStyle;
    direction?: 'right' | 'left';
    checked: boolean;
    isDisabled?: boolean;
    onChange: (value: boolean) => void;
}

/* Component ==================================================================== */
class Switch extends Component<Props> {
    declare readonly props: Props & Required<Pick<Props, keyof typeof Switch.defaultProps>>;

    static defaultProps: Partial<Props> = {
        direction: 'left',
    };

    onValueChange = (value: boolean) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    render() {
        const { title, direction, checked, isDisabled, testID } = this.props;

        let extraProps = {};

        // apply colors for android
        if (Platform.OS === 'android') {
            extraProps = {
                trackColor: { true: AppColors.blue, false: AppColors.grey },
                thumbColor: AppColors.light,
            };
        }

        return (
            <View style={styles.container}>
                {direction === 'right' && title && <Text style={styles.title}>{title}</Text>}
                <View style={styles.switch}>
                    <View>
                        <RNSwitch
                            testID={testID}
                            disabled={isDisabled}
                            onValueChange={this.onValueChange}
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={[styles.switch, { opacity: isDisabled && Platform.OS === 'android' ? 0.5 : 1 }]}
                            value={checked}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...extraProps}
                        />
                    </View>
                </View>
                {direction === 'left' && title && <Text style={styles.title}>{title}</Text>}
            </View>
        );
    }
}

export default Switch;
