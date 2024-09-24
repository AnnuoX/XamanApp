/**
 * Send Result Screen
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Text, Image, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

import NetworkService from '@services/NetworkService';

import { Images } from '@common/helpers/images';
import { Toast } from '@common/helpers/interface';
import { Navigator } from '@common/helpers/navigator';
import { Clipboard } from '@common/helpers/clipboard';

import { ContactRepository, AccountRepository } from '@store/repositories';

import { AppScreens } from '@common/constants';
import { Button, Footer, AmountText, Spacer } from '@components/General';
import Localize from '@locale';

import { AppStyles, AppColors } from '@theme';
import styles from './styles';

import { StepsContext } from '../../Context';

/* types ==================================================================== */
export interface Props {}

export interface State {
    showDetailsCard: boolean;
}

/* Component ==================================================================== */
class ResultStep extends Component<Props, State> {
    static contextType = StepsContext;
    context: React.ContextType<typeof StepsContext>;

    private showDetailsTimeout: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            showDetailsCard: false,
        };
    }

    componentDidMount() {
        const { payment } = this.context;

        if (payment.VerifyResult.success) {
            this.showDetailsTimeout = setTimeout(this.showDetailsCard, 4500);
        }
    }

    componentWillUnmount() {
        if (this.showDetailsTimeout) clearTimeout(this.showDetailsTimeout);
    }

    showDetailsCard = () => {
        LayoutAnimation.spring();
        this.setState({
            showDetailsCard: true,
        });
    };

    renderAddToContactButton = () => {
        const { destination } = this.context;

        // if destination is already in the contact list or it's or own account just ignore
        const contact = ContactRepository.findBy('address', destination.address);
        const account = AccountRepository.findBy('address', destination.address);

        if (contact.isEmpty() || account.isEmpty()) {
            return null;
        }

        return (
            <>
                <Spacer size={50} />
                <Button
                    icon="IconPlus"
                    secondary
                    roundedSmall
                    label={Localize.t('send.addToContacts')}
                    onPress={() => {
                        Navigator.popToRoot();

                        setTimeout(() => {
                            Navigator.push(AppScreens.Settings.AddressBook.Add, destination);
                        }, 1000);
                    }}
                />
            </>
        );
    };

    renderDetailsCard = () => {
        const { destination, amount, currency } = this.context;

        return (
            <View style={styles.detailsCard}>
                <Text style={[AppStyles.subtext, AppStyles.bold]}>{Localize.t('global.amount')}:</Text>
                <Spacer />

                <AmountText
                    style={[AppStyles.h4, AppStyles.monoBold]}
                    value={amount}
                    currency={
                        typeof currency === 'string' ? NetworkService.getNativeAsset() : currency.currency.currency
                    }
                    immutable
                />

                <Spacer />
                <View style={AppStyles.hr} />
                <Spacer />
                <Text style={[AppStyles.subtext, AppStyles.bold]}>{Localize.t('global.recipient')}:</Text>
                <Spacer />
                <Text style={[AppStyles.p, AppStyles.bold, AppStyles.colorBlue]}>
                    {destination.name || Localize.t('global.noNameFound')}
                </Text>
                <Text style={[AppStyles.subtext, AppStyles.mono]}>{destination.address}</Text>

                {this.renderAddToContactButton()}
            </View>
        );
    };

    renderSuccess = () => {
        const { showDetailsCard } = this.state;

        return (
            <SafeAreaView testID="send-result-view" style={[styles.container, styles.containerSuccess]}>
                <View style={[AppStyles.flex1, AppStyles.centerContent, AppStyles.paddingSml]}>
                    <Text style={[AppStyles.h3, AppStyles.strong, AppStyles.colorGreen, AppStyles.textCenterAligned]}>
                        {Localize.t('send.sendingDone')}
                    </Text>
                    <Text
                        style={[AppStyles.subtext, AppStyles.bold, AppStyles.colorGreen, AppStyles.textCenterAligned]}
                    >
                        {Localize.t('send.transferredSuccessfully', { network: NetworkService.getNetwork().name })}
                    </Text>
                </View>

                <View style={[AppStyles.flex2]}>
                    {showDetailsCard ? (
                        this.renderDetailsCard()
                    ) : (
                        <TouchableWithoutFeedback onPress={this.showDetailsCard}>
                            <Image style={styles.successImage} source={Images.ImageSuccessCheckMark} />
                        </TouchableWithoutFeedback>
                    )}
                </View>

                <Footer style={[]}>
                    <Button
                        onPress={() => {
                            Navigator.popToRoot();
                        }}
                        style={{ backgroundColor: AppColors.green }}
                        label={Localize.t('global.close')}
                    />
                </Footer>
            </SafeAreaView>
        );
    };

    renderFailed = () => {
        const { payment } = this.context;

        return (
            <SafeAreaView testID="send-result-view" style={[styles.container, styles.containerFailed]}>
                <View style={[AppStyles.flex1, AppStyles.centerContent, AppStyles.paddingSml]}>
                    <Text style={[AppStyles.h3, AppStyles.strong, AppStyles.colorRed, AppStyles.textCenterAligned]}>
                        {Localize.t('send.sendingFailed')}
                    </Text>
                    <Text style={[AppStyles.subtext, AppStyles.bold, AppStyles.colorRed, AppStyles.textCenterAligned]}>
                        {Localize.t('send.somethingWentWrong')}
                    </Text>
                </View>

                <View style={[AppStyles.flex2]}>
                    <View style={styles.detailsCard}>
                        <Text style={[AppStyles.subtext, AppStyles.bold]}>{Localize.t('global.code')}:</Text>
                        <Spacer />
                        <Text style={[AppStyles.p, AppStyles.monoBold]}>
                            {payment.TransactionResult?.code || 'Error'}
                        </Text>

                        <Spacer />
                        <View style={AppStyles.hr} />
                        <Spacer />
                        <Text style={[AppStyles.subtext, AppStyles.bold]}>{Localize.t('global.description')}:</Text>
                        <Spacer />
                        <Text style={[AppStyles.subtext]}>
                            {payment.TransactionResult?.message || 'No Description'}
                        </Text>

                        <Spacer size={50} />

                        <Button
                            secondary
                            roundedSmall
                            label={Localize.t('global.copy')}
                            style={AppStyles.stretchSelf}
                            onPress={() => {
                                Clipboard.setString(
                                    payment.TransactionResult?.message || payment.TransactionResult?.code || 'Error',
                                );
                                Toast(Localize.t('send.resultCopiedToClipboard'));
                            }}
                        />
                    </View>
                </View>

                <Footer style={[]}>
                    <Button
                        onPress={() => {
                            Navigator.popToRoot();
                        }}
                        style={{ backgroundColor: AppColors.red }}
                        label={Localize.t('global.close')}
                    />
                </Footer>
            </SafeAreaView>
        );
    };

    renderVerificationFailed = () => {
        return (
            <SafeAreaView testID="send-result-view" style={[styles.container, styles.containerVerificationFailed]}>
                <View style={[AppStyles.flex1, AppStyles.centerContent, AppStyles.paddingSml]}>
                    <Text style={[AppStyles.h3, AppStyles.strong, AppStyles.colorOrange, AppStyles.textCenterAligned]}>
                        {Localize.t('send.verificationFailed')}
                    </Text>
                    <Text
                        style={[AppStyles.subtext, AppStyles.bold, AppStyles.colorOrange, AppStyles.textCenterAligned]}
                    >
                        {Localize.t('send.couldNotVerifyTransaction')}
                    </Text>
                </View>

                <View style={[AppStyles.flex2]}>
                    <View style={styles.detailsCard}>
                        <Text style={[AppStyles.subtext, AppStyles.bold]}>{Localize.t('global.description')}:</Text>
                        <Spacer />
                        <Text style={[AppStyles.subtext]}>{Localize.t('send.verificationFailedDescription')}</Text>
                    </View>
                </View>

                <Footer style={[]}>
                    <Button
                        onPress={() => {
                            Navigator.popToRoot();
                        }}
                        style={{ backgroundColor: AppColors.orange }}
                        label={Localize.t('global.close')}
                    />
                </Footer>
            </SafeAreaView>
        );
    };

    render() {
        const { payment } = this.context;

        if (payment.TransactionResult?.success) {
            // submitted successfully but cannot verified
            if (payment.VerifyResult.success === false) {
                return this.renderVerificationFailed();
            }
            return this.renderSuccess();
        }

        return this.renderFailed();
    }
}

/* Export Component ==================================================================== */
export default ResultStep;
