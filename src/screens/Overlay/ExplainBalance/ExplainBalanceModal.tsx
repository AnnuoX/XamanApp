/**
 * Add Currency Screen
 */

import { sortBy, filter } from 'lodash';
import React, { Component } from 'react';
import { Animated, View, Text, TouchableWithoutFeedback, ScrollView, InteractionManager } from 'react-native';

import Interactable from 'react-native-interactable';

import { Navigator } from '@common/helpers/navigator';
import { Toast } from '@common/helpers/interface';
import { AppScreens } from '@common/constants';

import { AccountSchema, TrustLineSchema } from '@store/schemas/latest';

import LedgerService from '@services/LedgerService';

import { NormalizeCurrencyCode } from '@common/utils/amount';
import { CalculateAvailableBalance } from '@common/utils/balance';
// components
import { Avatar, Button, Icon, Spacer, LoadingIndicator } from '@components/General';

import Localize from '@locale';

// style
import { AppStyles, AppSizes } from '@theme';
import styles from './styles';

/* types ==================================================================== */
export interface Props {
    account: AccountSchema;
}

export interface State {
    isLoading: boolean;
    accountObjects: any;
    networkReserve: any;
}

/* Component ==================================================================== */
class ExplainBalanceOverlay extends Component<Props, State> {
    static screenName = AppScreens.Overlay.ExplainBalance;

    panel: any;
    deltaY: Animated.Value;
    deltaX: Animated.Value;
    isOpening: boolean;

    static options() {
        return {
            statusBar: {
                visible: true,
                style: 'light',
            },
            topBar: {
                visible: false,
            },
        };
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            accountObjects: [],
            networkReserve: LedgerService.getNetworkReserve(),
        };

        this.deltaY = new Animated.Value(AppSizes.screen.height);
        this.deltaX = new Animated.Value(0);

        this.isOpening = true;
    }

    componentDidMount() {
        this.slideUp();

        InteractionManager.runAfterInteractions(this.loadAccountObjects);
    }

    loadAccountObjects = () => {
        const { account } = this.props;

        LedgerService.getAccountObjects(account.address)
            .then((res: any) => {
                const { account_objects } = res;
                if (account_objects) {
                    // ignore trustline as we handle them in better way
                    // ignore incoming objects
                    const filtered = filter(account_objects, (o) => {
                        return o.LedgerEntryType !== 'RippleState' && o.Account === account.address;
                    });
                    this.setState({
                        accountObjects: sortBy(filtered),
                    });
                } else {
                    Toast(Localize.t('account.unableToCheckAccountObjects'));
                }
            })
            .catch(() => {
                Toast(Localize.t('account.unableToCheckAccountObjects'));
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    slideUp = () => {
        setTimeout(() => {
            if (this.panel) {
                this.panel.snapTo({ index: 1 });
            }
        }, 10);
    };

    slideDown = () => {
        setTimeout(() => {
            if (this.panel) {
                this.panel.snapTo({ index: 0 });
            }
        });
    };

    onAlert = (event: any) => {
        const { top, bottom } = event.nativeEvent;

        if (top && bottom) return;

        if (top === 'enter' && this.isOpening) {
            this.isOpening = false;
        }

        if (bottom === 'leave' && !this.isOpening) {
            Navigator.dismissOverlay();
        }
    };

    renderAccountObjects = () => {
        const { accountObjects, networkReserve } = this.state;

        if (accountObjects.length === 0) {
            return null;
        }

        return accountObjects.map((item: any, index: number) => {
            const { LedgerEntryType } = item;

            return (
                <View key={`object-${index}`} style={[styles.objectItemCard]}>
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <View style={[styles.iconContainer]}>
                            <Icon name="IconInfo" size={16} style={[AppStyles.imgColorGrey]} />
                        </View>
                        <Text style={[styles.rowLabel]}>{LedgerEntryType}</Text>
                    </View>
                    <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                        <Text style={[styles.reserveAmount]}>{networkReserve.OwnerReserve} XRP</Text>
                    </View>
                </View>
            );
        });
    };

    renderAccountLines = () => {
        const { account } = this.props;
        const { networkReserve } = this.state;

        if (account.lines.length === 0) return null;

        return (
            <>
                {account.lines.map((line: TrustLineSchema, index: number) => {
                    // don't render obligation trustlines
                    if (line.obligation) return null;

                    return (
                        <View key={`line-${index}`} style={[styles.objectItemCard]}>
                            <View style={[AppStyles.flex5, AppStyles.row, AppStyles.centerAligned]}>
                                <View style={[styles.brandAvatarContainer]}>
                                    <Avatar border size={32} source={{ uri: line.counterParty.avatar }} />
                                </View>
                                <Text style={[styles.rowLabel]}>
                                    {Localize.t('global.asset')}
                                    <Text style={styles.rowLabelSmall}>
                                        {` (${line.counterParty.name} ${NormalizeCurrencyCode(
                                            line.currency.currency,
                                        )})`}
                                    </Text>
                                </Text>
                            </View>
                            <View style={[AppStyles.flex1, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                                <Text style={[styles.reserveAmount]}>{networkReserve.OwnerReserve} XRP</Text>
                            </View>
                        </View>
                    );
                })}
            </>
        );
    };

    renderUnknownObjects = () => {
        const { account } = this.props;
        const { accountObjects, networkReserve } = this.state;

        if (account.ownerCount > accountObjects.length + account.lines.length) {
            const remainingOwner = account.ownerCount - (accountObjects.length + account.lines.length);

            return (
                <View style={[styles.objectItemCard]}>
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <View style={[styles.iconContainer]}>
                            <Icon name="IconInfo" size={15} style={[AppStyles.imgColorGrey]} />
                        </View>
                        <Text style={[styles.rowLabel]}>{Localize.t('global.otherReserveSeeExplorer')}</Text>
                    </View>
                    <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                        <Text style={[styles.reserveAmount]}>{remainingOwner * networkReserve.BaseReserve} XRP</Text>
                    </View>
                </View>
            );
        }
        return null;
    };

    renderTotalReserve = () => {
        const { account } = this.props;
        const { networkReserve } = this.state;
        return (
            <View>
                <View style={[styles.scrollStickyHeader]}>
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <View style={[styles.iconContainer]}>
                            <Icon name="IconLock" size={20} />
                        </View>
                        <Text style={[styles.rowLabelBig]}>{Localize.t('global.totalReserved')}</Text>
                    </View>
                    <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                        <Text style={[AppStyles.h5, AppStyles.monoBold]}>
                            {Localize.formatNumber(
                                account.ownerCount * networkReserve.OwnerReserve + networkReserve.BaseReserve,
                            )}{' '}
                            XRP
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    renderReserves = () => {
        const { networkReserve } = this.state;

        return (
            <View style={[AppStyles.paddingHorizontalSml, { marginBottom: AppSizes.navigationBarHeight }]}>
                <View style={[styles.objectItemCard]}>
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <View style={[styles.iconContainer]}>
                            <Icon name="IconAccount" size={15} style={[AppStyles.imgColorGrey]} />
                        </View>
                        <Text style={[styles.rowLabel]}>{Localize.t('account.walletReserve')}</Text>
                    </View>
                    <View style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}>
                        <Text style={[styles.reserveAmount]}>{networkReserve.BaseReserve} XRP</Text>
                    </View>
                </View>

                {this.renderAccountLines()}
                {this.renderAccountObjects()}
                {this.renderUnknownObjects()}

                <Spacer size={50} />
            </View>
        );
    };

    render() {
        const { account } = this.props;
        const { isLoading } = this.state;

        return (
            <View style={AppStyles.flex1}>
                <TouchableWithoutFeedback onPress={this.slideDown}>
                    <Animated.View
                        style={[
                            AppStyles.shadowContent,
                            {
                                opacity: this.deltaY.interpolate({
                                    inputRange: [0, AppSizes.screen.height],
                                    outputRange: [0.9, 0],
                                    extrapolateRight: 'clamp',
                                }),
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>

                <Interactable.View
                    ref={(r) => {
                        this.panel = r;
                    }}
                    animatedNativeDriver
                    onAlert={this.onAlert}
                    verticalOnly
                    snapPoints={[{ y: AppSizes.screen.height + 3 }, { y: AppSizes.heightPercentageToDP(10) }]}
                    boundaries={{ top: AppSizes.heightPercentageToDP(8) }}
                    initialPosition={{ y: AppSizes.screen.height }}
                    alertAreas={[
                        { id: 'bottom', influenceArea: { bottom: AppSizes.screen.height } },
                        { id: 'top', influenceArea: { top: AppSizes.heightPercentageToDP(10) } },
                    ]}
                    animatedValueY={this.deltaY}
                    animatedValueX={this.deltaX}
                >
                    <View style={[styles.visibleContent]}>
                        <View style={AppStyles.panelHeader}>
                            <View style={AppStyles.panelHandle} />
                        </View>

                        <View style={[AppStyles.row, AppStyles.centerAligned, AppStyles.paddingBottomSml]}>
                            <View style={[AppStyles.flex1, AppStyles.paddingLeftSml]}>
                                <Text numberOfLines={1} style={[AppStyles.h5, AppStyles.strong]}>
                                    {Localize.t('global.balance')}
                                </Text>
                            </View>
                            <View
                                style={[AppStyles.row, AppStyles.flex1, AppStyles.paddingRightSml, AppStyles.flexEnd]}
                            >
                                <Button
                                    numberOfLines={1}
                                    light
                                    roundedSmall
                                    isDisabled={false}
                                    onPress={() => {
                                        this.slideDown();
                                    }}
                                    textStyle={[AppStyles.subtext, AppStyles.bold]}
                                    label={Localize.t('global.close')}
                                />
                            </View>
                        </View>
                        <View
                            style={[
                                AppStyles.row,
                                AppStyles.centerContent,
                                AppStyles.paddingBottom,
                                AppStyles.paddingHorizontalSml,
                            ]}
                        >
                            <Text style={[AppStyles.p, AppStyles.subtext, AppStyles.textCenterAligned]}>
                                {Localize.t('home.xrpYouOwnVsYourSpendableBalance')}
                            </Text>
                        </View>

                        <View style={[AppStyles.paddingHorizontalSml]}>
                            <Text style={[styles.rowTitle]}>{Localize.t('account.accountBalance')}</Text>
                            <View style={[styles.objectItemCard]}>
                                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                    <View style={[styles.iconContainer]}>
                                        <Icon name="IconXrp" size={20} style={[AppStyles.imgColorGrey]} />
                                    </View>
                                    <Text style={[styles.currencyLabel, AppStyles.colorGrey]}>XRP</Text>
                                </View>
                                <View
                                    style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}
                                >
                                    <Text style={[AppStyles.h5, AppStyles.monoBold, AppStyles.colorGrey]}>
                                        {Localize.formatNumber(account.balance)}
                                    </Text>
                                </View>
                            </View>

                            <Spacer size={30} />

                            <Text style={[styles.rowTitle]}>{Localize.t('account.availableForSpending')}</Text>
                            <View style={[styles.objectItemCard]}>
                                <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                    <View style={[styles.iconContainer]}>
                                        <Icon name="IconXrp" size={20} />
                                    </View>
                                    <Text style={[styles.currencyLabel]}>XRP</Text>
                                </View>
                                <View
                                    style={[AppStyles.flex4, AppStyles.row, AppStyles.centerAligned, AppStyles.flexEnd]}
                                >
                                    <Text style={[AppStyles.h5, AppStyles.monoBold]}>
                                        {Localize.formatNumber(CalculateAvailableBalance(account))}
                                    </Text>
                                </View>
                            </View>
                            <Spacer size={30} />
                            <Text style={[styles.rowTitle]}>{Localize.t('global.reservedOnLedger')}</Text>
                            <Spacer size={10} />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            bounces={false}
                            contentContainerStyle={[AppStyles.stretchSelf]}
                            stickyHeaderIndices={[0]}
                        >
                            {this.renderTotalReserve()}
                            {isLoading ? (
                                <>
                                    <Spacer size={20} />
                                    <LoadingIndicator />
                                </>
                            ) : (
                                this.renderReserves()
                            )}
                        </ScrollView>
                    </View>
                </Interactable.View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default ExplainBalanceOverlay;
